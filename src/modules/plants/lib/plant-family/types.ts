export interface PlantFamily {
    id: string;
    name: string;
    description: string;
    created_date: string;
}

export interface CreatePlantFamilyDTO {
    name: string;
    description: string;
}