export type RouteDestination = {
  readonly id: string;
  readonly city: string;
  readonly uf: string;
  readonly lon: number;
  readonly lat: number;
  readonly priority: boolean;
  readonly group: "nordeste" | "centro-sul";
};

export const routeOrigin = {
  city: "Petrolina",
  uf: "PE",
  lon: -40.5,
  lat: -9.39,
} as const;

// Destinos com evidência: reunião de 14/10/2026 (São Paulo, Brasília, Nordeste,
// região de BH), avaliações públicas (João Pessoa, São Paulo) e rotas já no site.
export const routeDestinations = [
  { id: "sao-paulo", city: "São Paulo", uf: "SP", lon: -46.63, lat: -23.55, priority: true, group: "centro-sul" },
  { id: "brasilia", city: "Brasília", uf: "DF", lon: -47.88, lat: -15.79, priority: true, group: "centro-sul" },
  { id: "salvador", city: "Salvador", uf: "BA", lon: -38.5, lat: -12.97, priority: false, group: "nordeste" },
  { id: "recife", city: "Recife", uf: "PE", lon: -34.88, lat: -8.05, priority: false, group: "nordeste" },
  { id: "fortaleza", city: "Fortaleza", uf: "CE", lon: -38.54, lat: -3.72, priority: false, group: "nordeste" },
  { id: "joao-pessoa", city: "João Pessoa", uf: "PB", lon: -34.86, lat: -7.12, priority: false, group: "nordeste" },
  { id: "belo-horizonte", city: "Belo Horizonte", uf: "MG", lon: -43.94, lat: -19.92, priority: false, group: "centro-sul" },
] as const satisfies readonly RouteDestination[];

export const nordesteUfs = ["AL", "BA", "CE", "MA", "PB", "PE", "PI", "RN", "SE"] as const;
