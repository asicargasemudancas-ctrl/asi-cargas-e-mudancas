"use client";

import { ArrowRight, MousePointerClick, RotateCcw, Route as RouteIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type * as Three from "three";

import { nordesteUfs, routeDestinations, routeOrigin } from "@/data/route-destinations";
import { formatKm, roadEstimateKm, straightLineKm, travelDays } from "@/lib/route-distance";
import { buildQuickQuoteMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

type UfGeometry = {
  readonly uf: string;
  readonly region: string;
  readonly polygons: readonly (readonly (readonly [number, number])[])[];
};

type MapPoint = {
  readonly id: string;
  readonly city: string;
  readonly uf: string;
  readonly lon: number;
  readonly lat: number;
  readonly priority: boolean;
  readonly origin: boolean;
};

const mapPoints: readonly MapPoint[] = [
  { id: "petrolina", city: routeOrigin.city, uf: routeOrigin.uf, lon: routeOrigin.lon, lat: routeOrigin.lat, priority: false, origin: true },
  ...routeDestinations.map((item) => ({ id: item.id, city: item.city, uf: item.uf, lon: item.lon, lat: item.lat, priority: item.priority, origin: false })),
];

const pointById = new Map(mapPoints.map((point) => [point.id, point]));

type LabelPlacement = { readonly dx: number; readonly dy: number; readonly align: "left" | "right" | "center" };

// Posição do rótulo em relação ao ponto projetado (px). Evita sobreposição no litoral.
const labelPlacement: Readonly<Record<string, LabelPlacement>> = {
  petrolina: { dx: -14, dy: 12, align: "right" },
  "sao-paulo": { dx: -14, dy: 6, align: "right" },
  brasilia: { dx: -14, dy: -14, align: "right" },
  salvador: { dx: 14, dy: 0, align: "left" },
  recife: { dx: 14, dy: 8, align: "left" },
  fortaleza: { dx: 0, dy: -30, align: "center" },
  "joao-pessoa": { dx: 14, dy: -22, align: "left" },
  "belo-horizonte": { dx: 14, dy: 2, align: "left" },
};

// Linha do tempo da animação de entrada, em segundos.
const routeStart: Readonly<Record<string, number>> = {
  salvador: 1.7,
  recife: 2.1,
  "joao-pessoa": 2.45,
  fortaleza: 2.8,
  "belo-horizonte": 3.35,
  brasilia: 3.95,
  "sao-paulo": 4.7,
};

const shortcuts = [
  ["petrolina", "sao-paulo"],
  ["petrolina", "brasilia"],
  ["petrolina", "recife"],
] as const;

const LON0 = -52.5;
const LAT0 = -14.5;
const COS_LAT0 = Math.cos((LAT0 * Math.PI) / 180);
const DEPTH = 0.55;
const FINAL_TIME = 9;

const project = (lon: number, lat: number) => [(lon - LON0) * COS_LAT0, lat - LAT0] as const;
const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const easeOut = (value: number) => 1 - (1 - clamp01(value)) ** 3;
const easeInOut = (value: number) => {
  const t = clamp01(value);
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
};

type MapApi = { setSelection: (ids: readonly string[]) => void };

export function RouteMap3D() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const apiRef = useRef<MapApi | null>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [selection, setSelection] = useState<readonly string[]>([]);

  useEffect(() => {
    apiRef.current?.setSelection(selection);
  }, [selection, ready]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    let disposed = false;
    let started = false;
    let visible = false;
    let frame = 0;
    let teardown: () => void = () => {};
    let resume: () => void = () => {};

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !started) {
        started = true;
        void boot();
      } else if (visible) {
        resume();
      }
    }, { rootMargin: "240px 0px" });
    observer.observe(wrap);

    async function boot() {
      const [THREE, geometryModule] = await Promise.all([
        import("three"),
        import("@/data/brazil-uf.json"),
      ]);
      if (disposed || !wrap || !canvas) return;
      const states = geometryModule.default as unknown as readonly UfGeometry[];
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      let renderer: Three.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
      } catch {
        setFailed(true);
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 400);
      camera.up.set(0, 0, 1);

      scene.add(new THREE.HemisphereLight(0xcfdcff, 0x050a1c, 1.25));
      const sun = new THREE.DirectionalLight(0xffffff, 1.6);
      sun.position.set(-18, -26, 40);
      scene.add(sun);

      const disposables: { dispose: () => void }[] = [];
      const track = <T extends { dispose: () => void }>(item: T) => {
        disposables.push(item);
        return item;
      };

      const baseColor = new THREE.Color("#132a5e");
      const nordesteColor = new THREE.Color("#1f4594");
      const brasilColor = new THREE.Color("#1a3878");
      const priorityGlow = new THREE.Color("#ffc107");
      const selectGlow = new THREE.Color("#8fb4ff");
      const sideMaterial = track(new THREE.MeshStandardMaterial({ color: "#0a1838", roughness: 0.9, metalness: 0.05 }));
      const borderMaterial = track(new THREE.LineBasicMaterial({ color: "#9fb7ff", transparent: true, opacity: 0.28 }));

      const [originX, originY] = project(routeOrigin.lon, routeOrigin.lat);
      const priorityUfs = new Set<string>(routeDestinations.filter((item) => item.priority).map((item) => item.uf));
      const nordeste = new Set<string>(nordesteUfs);

      type StateMesh = { group: Three.Group; material: Three.MeshStandardMaterial; delay: number; uf: string };
      const stateMeshes: StateMesh[] = [];

      for (const state of states) {
        const shapes: Three.Shape[] = [];
        const group = new THREE.Group();
        for (const ring of state.polygons) {
          const points = ring.map(([lon, lat]) => {
            const [x, y] = project(lon, lat);
            return new THREE.Vector2(x, y);
          });
          if (points.length > 2 && points[0].equals(points[points.length - 1])) points.pop();
          shapes.push(new THREE.Shape(points));
          const border = track(new THREE.BufferGeometry().setFromPoints(points.map((point) => new THREE.Vector3(point.x, point.y, DEPTH + 0.02))));
          group.add(new THREE.LineLoop(border, borderMaterial));
        }
        const geometry = track(new THREE.ExtrudeGeometry(shapes, { depth: DEPTH, bevelEnabled: false }));
        const material = track(new THREE.MeshStandardMaterial({ color: baseColor.clone(), roughness: 0.62, metalness: 0.12, emissive: new THREE.Color("#000000") }));
        group.add(new THREE.Mesh(geometry, [material, sideMaterial]));
        geometry.computeBoundingBox();
        const center = new THREE.Vector3();
        geometry.boundingBox?.getCenter(center);
        const distance = Math.hypot(center.x - originX, center.y - originY);
        scene.add(group);
        stateMeshes.push({ group, material, delay: Math.min(distance / 38, 1) * 0.75, uf: state.uf });
      }

      const top = DEPTH + 0.04;
      const worldOf = (point: MapPoint) => {
        const [x, y] = project(point.lon, point.lat);
        return new THREE.Vector3(x, y, top);
      };
      const origin = new THREE.Vector3(originX, originY, top);

      const goldMaterial = track(new THREE.MeshBasicMaterial({ color: "#ffc107" }));
      const whiteMaterial = track(new THREE.MeshBasicMaterial({ color: "#ffffff" }));
      const pinGeometry = track(new THREE.CylinderGeometry(0.32, 0.32, 0.5, 24));
      const originPin = new THREE.Mesh(pinGeometry, goldMaterial);
      originPin.rotation.x = Math.PI / 2;
      originPin.position.set(originX, originY, top + 0.25);
      scene.add(originPin);

      const ringGeometry = track(new THREE.RingGeometry(0.55, 0.75, 48));
      const makePulse = (color: string, x: number, y: number) => {
        const material = track(new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }));
        const ring = new THREE.Mesh(ringGeometry, material);
        ring.position.set(x, y, top + 0.03);
        scene.add(ring);
        return { ring, material };
      };
      const originPulses = [makePulse("#ffc107", originX, originY), makePulse("#ffc107", originX, originY)];

      const radial = 10;
      const segments = 96;
      const dotGeometry = track(new THREE.SphereGeometry(0.22, 18, 18));

      const arc = (from: Three.Vector3, to: Three.Vector3, lift = 0.42) => {
        const mid = from.clone().lerp(to, 0.5);
        mid.z = top + 1.2 + from.distanceTo(to) * lift;
        return new THREE.QuadraticBezierCurve3(from.clone(), mid, to.clone());
      };

      type RouteMesh = {
        id: string;
        uf: string;
        priority: boolean;
        curve: Three.QuadraticBezierCurve3;
        tube: Three.TubeGeometry;
        material: Three.MeshBasicMaterial;
        start: number;
        duration: number;
        dot: Three.Mesh;
        pin: Three.Mesh;
        pulse: ReturnType<typeof makePulse>;
      };
      const routes: RouteMesh[] = [];

      for (const destination of routeDestinations) {
        const end = worldOf(pointById.get(destination.id)!);
        const curve = arc(origin, end);
        const tube = track(new THREE.TubeGeometry(curve, segments, destination.priority ? 0.17 : 0.09, radial, false));
        const material = track(new THREE.MeshBasicMaterial({ color: destination.priority ? "#ffc107" : "#8fb4ff", transparent: true, opacity: 1 }));
        tube.setDrawRange(0, 0);
        scene.add(new THREE.Mesh(tube, material));

        const pin = new THREE.Mesh(pinGeometry, destination.priority ? goldMaterial : whiteMaterial);
        pin.rotation.x = Math.PI / 2;
        pin.scale.setScalar(destination.priority ? 0.85 : 0.55);
        pin.position.set(end.x, end.y, top + 0.2);
        pin.visible = false;
        scene.add(pin);

        const dot = new THREE.Mesh(dotGeometry, destination.priority ? goldMaterial : whiteMaterial);
        dot.scale.setScalar(destination.priority ? 1 : 0.7);
        dot.visible = false;
        scene.add(dot);

        routes.push({
          id: destination.id,
          uf: destination.uf,
          priority: destination.priority,
          curve,
          tube,
          material,
          start: routeStart[destination.id] ?? 2,
          duration: 0.75 + origin.distanceTo(end) * 0.045,
          dot,
          pin,
          pulse: makePulse(destination.priority ? "#ffc107" : "#8fb4ff", end.x, end.y),
        });
      }

      // Medição entre duas cidades escolhidas pelo usuário.
      const measureMaterial = track(new THREE.MeshBasicMaterial({ color: "#ffffff" }));
      const measureGlowMaterial = track(new THREE.MeshBasicMaterial({ color: "#ffc107", transparent: true, opacity: 0.28, depthWrite: false }));
      const measureDot = new THREE.Mesh(dotGeometry, measureMaterial);
      measureDot.scale.setScalar(1.25);
      measureDot.visible = false;
      scene.add(measureDot);
      const selectionPulses = [makePulse("#ffffff", 0, 0), makePulse("#ffffff", 0, 0)];
      let measure: { curve: Three.QuadraticBezierCurve3; tube: Three.TubeGeometry; glow: Three.TubeGeometry; meshes: Three.Mesh[]; startedAt: number } | null = null;
      let selected: readonly string[] = [];
      let selectedAt = 0;

      // Enquadramento padrão: região das rotas (Centro-Oeste, Sudeste e Nordeste).
      const [focusMinX, focusMinY] = project(-57, -25.5);
      const [focusMaxX, focusMaxY] = project(-33.5, -1.5);
      const homeTarget = new THREE.Vector3((focusMinX + focusMaxX) / 2, (focusMinY + focusMaxY) / 2 - 1.2, 0);
      const mapSize = new THREE.Vector2(focusMaxX - focusMinX, focusMaxY - focusMinY);
      const target = homeTarget.clone();
      const desiredTarget = homeTarget.clone();
      let zoom = 1;
      let desiredZoom = 1;

      let width = 1;
      let height = 1;
      let baseDistance = 80;
      const tilt = THREE.MathUtils.degToRad(34);
      const drag = { active: false, x: 0, y: 0, azimuth: 0, tilt: 0, moved: false };

      function resize() {
        if (!wrap) return;
        width = Math.max(1, canvas!.clientWidth);
        height = Math.max(1, canvas!.clientHeight);
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        const vertical = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
        const fitHeight = (mapSize.y * 0.82) / 2 / vertical;
        const fitWidth = (mapSize.x / 2) / (vertical * camera.aspect);
        baseDistance = Math.max(fitHeight, fitWidth) * 1.02 + 2;
      }

      const labels = new Map<string, HTMLElement>();
      wrap.querySelectorAll<HTMLElement>("[data-route-label]").forEach((element) => {
        labels.set(element.dataset.routeLabel ?? "", element);
      });
      const labelPosition = new THREE.Vector3();
      function placeLabel(id: string, anchor: Three.Vector3, opacity: number) {
        const element = labels.get(id);
        if (!element) return;
        labelPosition.copy(anchor).project(camera);
        const placement = labelPlacement[id] ?? { dx: 12, dy: 0, align: "left" as const };
        const labelWidth = element.offsetWidth;
        const labelHeight = element.offsetHeight;
        let left = ((labelPosition.x + 1) / 2) * width + placement.dx;
        if (placement.align === "right") left -= labelWidth;
        if (placement.align === "center") left -= labelWidth / 2;
        let topPx = ((1 - labelPosition.y) / 2) * height + placement.dy - labelHeight / 2;
        left = Math.min(Math.max(left, 4), width - labelWidth - 4);
        topPx = Math.min(Math.max(topPx, 4), height - labelHeight - 4);
        element.style.transform = `translate3d(${left.toFixed(1)}px, ${topPx.toFixed(1)}px, 0)`;
        element.style.opacity = opacity.toFixed(3);
        element.style.pointerEvents = opacity > 0.5 ? "auto" : "none";
      }

      let startTime = performance.now();
      const clock = () => (reduceMotion ? FINAL_TIME + 2 : (performance.now() - startTime) / 1000);
      const anchors = new Map(mapPoints.map((point) => [point.id, worldOf(point).add(new THREE.Vector3(0, 0, 0.3))]));

      function setMeasure(ids: readonly string[]) {
        selected = ids;
        selectedAt = clock();
        // Se o usuário interage antes do fim da entrada, a animação pula para o estado final.
        if (!reduceMotion && clock() < FINAL_TIME - 2) startTime = performance.now() - (FINAL_TIME - 2) * 1000;
        if (measure) {
          for (const mesh of measure.meshes) scene.remove(mesh);
          measure.tube.dispose();
          measure.glow.dispose();
          measure = null;
        }
        if (ids.length === 2) {
          const a = worldOf(pointById.get(ids[0])!);
          const b = worldOf(pointById.get(ids[1])!);
          const curve = arc(a, b, 0.5);
          const tube = new THREE.TubeGeometry(curve, segments, 0.13, radial, false);
          const glow = new THREE.TubeGeometry(curve, segments, 0.36, radial, false);
          tube.setDrawRange(0, 0);
          glow.setDrawRange(0, 0);
          const meshes = [new THREE.Mesh(glow, measureGlowMaterial), new THREE.Mesh(tube, measureMaterial)];
          for (const mesh of meshes) scene.add(mesh);
          measure = { curve, tube, glow, meshes, startedAt: clock() };
          desiredTarget.copy(a).lerp(b, 0.5).setZ(0);
          desiredTarget.y -= 0.6;
          const span = a.distanceTo(b);
          desiredZoom = clamp(0.42 + span / 32, 0.55, 1);
        } else {
          desiredTarget.copy(homeTarget);
          desiredZoom = 1;
        }
        ids.forEach((id, index) => {
          const point = anchors.get(id);
          if (point) selectionPulses[index].ring.position.set(point.x, point.y, top + 0.05);
        });
        if (reduceMotion) {
          target.copy(desiredTarget);
          zoom = desiredZoom;
        }
        requestRender();
      }

      function renderAt(t: number) {
        target.lerp(desiredTarget, reduceMotion ? 1 : 0.06);
        zoom += (desiredZoom - zoom) * (reduceMotion ? 1 : 0.06);
        if (!drag.active) {
          drag.azimuth *= 0.985;
          drag.tilt *= 0.985;
        }
        const sway = reduceMotion ? 0 : Math.sin(t * 0.18) * 0.05;
        const azimuth = sway + drag.azimuth;
        const tiltNow = clamp(tilt + drag.tilt, 0.2, 0.95);
        const distance = baseDistance * zoom * (reduceMotion ? 1 : 1.06 - 0.06 * easeOut(t / 3));
        camera.position.set(
          target.x + Math.sin(azimuth) * Math.sin(tiltNow) * distance,
          target.y - Math.cos(azimuth) * Math.sin(tiltNow) * distance,
          target.z + Math.cos(tiltNow) * distance,
        );
        camera.lookAt(target);

        const measuring = measure !== null;
        const selectedUfs = new Set(selected.map((id) => pointById.get(id)?.uf));

        for (const state of stateMeshes) {
          const rise = easeOut((t - state.delay) / 0.9);
          state.group.scale.z = Math.max(0.001, rise);
          state.group.position.z = (1 - rise) * -1.5;
          const highlight = nordeste.has(state.uf) ? easeInOut((t - 1.1) / 0.8) : 0;
          // Fim da entrada: o país inteiro acende, reforçando o atendimento em todo o Brasil.
          const nationwide = easeInOut((t - 6.2) / 1.2);
          state.material.color.copy(baseColor).lerp(brasilColor, nationwide).lerp(nordesteColor, measuring ? highlight * 0.5 : highlight);
          state.material.emissive.setRGB(0, 0, 0);
          if (selectedUfs.has(state.uf)) {
            state.material.emissive.copy(selectGlow).multiplyScalar(0.18);
          } else if (priorityUfs.has(state.uf) && !measuring) {
            const route = routes.find((item) => item.uf === state.uf);
            const arrival = route ? easeOut((t - route.start - route.duration) / 0.6) : 0;
            const breathe = reduceMotion ? 1 : 0.8 + Math.sin(t * 2.2) * 0.2;
            state.material.emissive.copy(priorityGlow).multiplyScalar(0.22 * arrival * breathe);
          }
        }

        originPin.scale.setScalar(Math.max(0.001, easeOut((t - 0.6) / 0.5)));
        originPulses.forEach(({ ring, material }, index) => {
          const phase = reduceMotion ? 0.35 : ((t * 0.55 + index * 0.5) % 1);
          ring.scale.setScalar(0.6 + phase * 2.6);
          material.opacity = t < 0.8 || measuring ? 0 : (1 - phase) * 0.55;
        });

        routes.forEach((route, index) => {
          const progress = easeInOut((t - route.start) / route.duration);
          route.tube.setDrawRange(0, Math.floor(progress * segments) * radial * 6);
          route.material.opacity += ((measuring ? 0.16 : 1) - route.material.opacity) * (reduceMotion ? 1 : 0.12);
          const arrived = progress >= 1;
          route.pin.visible = progress > 0.98;
          const sinceArrival = t - route.start - route.duration;
          if (!arrived) {
            route.dot.visible = progress > 0;
            if (progress > 0) route.dot.position.copy(route.curve.getPoint(progress));
          } else {
            route.dot.visible = !reduceMotion && !measuring;
            const loop = ((sinceArrival * 0.16 + index * 0.13) % 1 + 1) % 1;
            route.dot.position.copy(route.curve.getPoint(loop));
          }
          const pulsePhase = reduceMotion ? 0.4 : (sinceArrival * (route.priority ? 0.7 : 0.45)) % 1;
          route.pulse.ring.scale.setScalar((route.priority ? 0.9 : 0.6) + pulsePhase * 2);
          route.pulse.material.opacity = !measuring && arrived && (route.priority || sinceArrival < 2.2 || reduceMotion) ? (1 - pulsePhase) * 0.6 : 0;
        });

        selectionPulses.forEach(({ ring, material }, index) => {
          const active = index < selected.length;
          const phase = reduceMotion ? 0.3 : ((t - selectedAt) * 0.8 + index * 0.4) % 1;
          ring.scale.setScalar(0.7 + phase * 2.2);
          material.opacity = active ? (1 - phase) * 0.85 : 0;
        });

        if (measure) {
          const progress = reduceMotion ? 1 : easeInOut((t - measure.startedAt) / 0.9);
          const count = Math.floor(progress * segments) * radial * 6;
          measure.tube.setDrawRange(0, count);
          measure.glow.setDrawRange(0, count);
          measureDot.visible = progress > 0 && !reduceMotion;
          const travel = progress < 1 ? progress : ((t - measure.startedAt - 0.9) * 0.22) % 1;
          measureDot.position.copy(measure.curve.getPoint(travel));
        } else {
          measureDot.visible = false;
        }

        renderer.render(scene, camera);

        for (const point of mapPoints) {
          const anchor = anchors.get(point.id)!;
          const intro = point.origin
            ? easeOut((t - 0.7) / 0.5)
            : easeOut((t - (routeStart[point.id] ?? 2) - (routes.find((item) => item.id === point.id)?.duration ?? 1) * 0.85) / 0.45);
          const dimmed = selected.length === 2 && !selected.includes(point.id) ? 0.55 : 1;
          placeLabel(point.id, anchor, intro * dimmed);
        }
      }

      function loop() {
        frame = 0;
        if (disposed || !visible || document.hidden) return;
        renderAt(clock());
        frame = requestAnimationFrame(loop);
      }

      function requestRender() {
        if (reduceMotion) {
          renderAt(clock());
          return;
        }
        if (!frame && visible) frame = requestAnimationFrame(loop);
      }

      resume = requestRender;
      apiRef.current = { setSelection: setMeasure };

      const resizeObserver = new ResizeObserver(() => {
        resize();
        renderAt(clock());
      });
      resizeObserver.observe(canvas);

      const onDown = (event: PointerEvent) => {
        if ((event.target as HTMLElement).closest("button, a")) return;
        drag.active = true;
        drag.moved = false;
        drag.x = event.clientX;
        drag.y = event.clientY;
      };
      const onMove = (event: PointerEvent) => {
        if (!drag.active) return;
        const dx = event.clientX - drag.x;
        const dy = event.clientY - drag.y;
        if (Math.abs(dx) + Math.abs(dy) > 3) drag.moved = true;
        drag.x = event.clientX;
        drag.y = event.clientY;
        drag.azimuth = clamp(drag.azimuth - dx * 0.004, -0.6, 0.6);
        drag.tilt = clamp(drag.tilt + dy * 0.003, -0.3, 0.3);
        wrap.dataset.dragging = "true";
        requestRender();
      };
      const onUp = () => {
        drag.active = false;
        delete wrap.dataset.dragging;
      };
      const onVisibility = () => {
        if (!document.hidden && visible) requestRender();
      };
      canvas.addEventListener("pointerdown", onDown);
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      document.addEventListener("visibilitychange", onVisibility);

      resize();
      setReady(true);
      requestRender();

      teardown = () => {
        cancelAnimationFrame(frame);
        apiRef.current = null;
        resizeObserver.disconnect();
        canvas.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        document.removeEventListener("visibilitychange", onVisibility);
        if (measure) {
          measure.tube.dispose();
          measure.glow.dispose();
        }
        for (const item of disposables) item.dispose();
        renderer.dispose();
      };
    }

    return () => {
      disposed = true;
      observer.disconnect();
      teardown();
    };
  }, []);

  function pick(id: string) {
    setSelection((current) => {
      if (current.length === 1 && current[0] !== id) return [current[0], id];
      if (current.length === 1 && current[0] === id) return [];
      return [id];
    });
  }

  const from = selection[0] ? pointById.get(selection[0]) : undefined;
  const to = selection[1] ? pointById.get(selection[1]) : undefined;

  return (
    <div className="route-map-shell">
      <div
        ref={wrapRef}
        data-testid="route-map-3d"
        data-ready={ready ? "true" : "false"}
        className="route-map relative aspect-[4/5] w-full overflow-hidden sm:aspect-[5/4] lg:aspect-[1/1]"
      >
        {failed ? (
          <Image src="/assets/asi-routes-map-premium-1600x900.webp" alt="Mapa de rotas da ASI saindo de Petrolina" fill sizes="(min-width:1024px) 55vw, 100vw" className="object-cover" />
        ) : (
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
        )}
        <div className="pointer-events-none absolute inset-0">
          {mapPoints.map((point) => {
            const order = selection.indexOf(point.id);
            return (
              <button
                key={point.id}
                type="button"
                data-route-label={point.id}
                data-testid={`map-city-${point.id}`}
                aria-pressed={order >= 0}
                aria-label={`${point.city}, ${point.uf}${order === 0 ? " (origem escolhida)" : order === 1 ? " (destino escolhido)" : ""}`}
                onClick={() => pick(point.id)}
                className={`route-label ${point.priority ? "route-label--priority" : ""} ${point.origin ? "route-label--origin" : ""} ${order >= 0 ? "is-selected" : ""}`}
              >
                {order >= 0 && <i className="route-label__step" aria-hidden="true">{order === 0 ? "A" : "B"}</i>}
                <b>{point.city}</b><small>{point.origin ? "base · " : ""}{point.uf}</small>
              </button>
            );
          })}
        </div>
        <span data-testid="map-brasil-badge" className="route-map__brasil pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-[#ffc107]/60 bg-[#ffc107] px-3 py-1.5 text-xs font-black uppercase tracking-[0.08em] text-[#07142f] shadow-[0_8px_24px_rgba(255,193,7,.3)]">+ Todo o Brasil</span>
        <span className="route-map__hint pointer-events-none absolute right-3 top-3 hidden items-center gap-1.5 rounded-full border border-white/12 bg-[#07142f]/70 px-3 py-1.5 font-mono text-[0.62rem] font-bold uppercase tracking-[0.12em] text-white/70 backdrop-blur sm:inline-flex">
          <MousePointerClick className="size-3.5 text-[#ffc107]" aria-hidden="true" /> Arraste para girar
        </span>
      </div>
      <DistancePanel from={from} to={to} onPick={(a, b) => setSelection([a, b])} onReset={() => setSelection([])} />
      <p className="sr-only">
        Mapa interativo com rotas saindo de Petrolina para {routeDestinations.map((destination) => `${destination.city} (${destination.uf})`).join(", ")}. São Paulo e Brasília aparecem como rotas prioritárias. Toque em duas cidades para ver a distância estimada.
      </p>
    </div>
  );
}

function DistancePanel({
  from,
  to,
  onPick,
  onReset,
}: Readonly<{
  from?: MapPoint;
  to?: MapPoint;
  onPick: (a: string, b: string) => void;
  onReset: () => void;
}>) {
  const roadKm = from && to ? roadEstimateKm(from, to) : 0;
  const lineKm = from && to ? straightLineKm(from, to) : 0;
  const days = roadKm ? travelDays(roadKm) : 0;
  const route = from && to ? `${from.city} para ${to.city}` : "";

  return (
    <div data-testid="route-distance-panel" aria-live="polite" className="route-panel relative z-10 mt-3 rounded-[1rem] border border-white/14 bg-[#0b1a44]/80 p-4 shadow-[0_24px_60px_rgba(0,0,0,.35)] backdrop-blur-xl sm:p-5">
      {from && to ? (
        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#ffc107]">Distância estimada</span>
              <span className="flex items-center gap-1.5 text-sm font-bold text-white">{from.city}<ArrowRight className="size-3.5 text-[#ffc107]" aria-hidden="true" />{to.city}</span>
            </div>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <strong data-testid="route-distance-km" className="text-[2.2rem] font-black leading-none tracking-[-0.04em] text-white">≈ {formatKm(roadKm)}</strong>
              <span className="text-xs leading-5 text-white/62">por estrada · cerca de {days} {days === 1 ? "dia" : "dias"} de viagem · {formatKm(lineKm)} em linha reta</span>
            </div>
            <p className="mt-2 text-[0.68rem] leading-4 text-white/40">Estimativa para referência. Rota, prazo e valor são confirmados no orçamento.</p>
          </div>
          <div className="flex gap-2 sm:flex-col">
            <a href={buildWhatsAppUrl(buildQuickQuoteMessage("rotas_mapa", { page: "home", route }))} target="_blank" rel="noopener noreferrer" className="fluid-press inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md bg-[#25d366] px-4 text-sm font-black text-[#07142f] hover:bg-[#47dd7c]">Cotar esta rota</a>
            <button type="button" onClick={onReset} className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-md border border-white/16 px-4 text-xs font-bold text-white/70 hover:border-white/40 hover:text-white"><RotateCcw className="size-3.5" aria-hidden="true" />Nova consulta</button>
          </div>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-[auto_1fr] sm:items-center">
          <div>
            <span className="flex items-center gap-2 font-mono text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#ffc107]"><RouteIcon className="size-3.5" aria-hidden="true" />Calcule a distância</span>
            <p className="mt-1.5 text-sm font-bold leading-5 text-white">{from ? <>Origem: {from.city}. Agora toque no destino.</> : "Toque em duas cidades no mapa."}</p>
          </div>
          <div className="flex flex-wrap gap-2 sm:justify-end">
            {shortcuts.map(([a, b]) => (
              <button key={b} type="button" onClick={() => onPick(a, b)} className="rounded-full border border-white/16 bg-white/[.06] px-3 py-1.5 text-xs font-bold text-white/85 transition hover:border-[#ffc107] hover:text-[#ffdd6b]">
                Petrolina → {pointById.get(b)?.city}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
