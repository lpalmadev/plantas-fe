export interface PlantSpecies {
    id: string;
    name: string;
    description: string;
    created_date: string;
}

export interface CreatePlantSpeciesDTO {
    name: string;
    description: string;
}