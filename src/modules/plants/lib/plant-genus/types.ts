export interface PlantGenus {
    id: string;
    name: string;
    description: string;
    created_date: string;
}

export interface CreatePlantGenusDTO {
    name: string;
    description: string;
}