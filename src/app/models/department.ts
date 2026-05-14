export interface Department {
    id: string;
    name: string;
    description: string;
    created_date: string;
    floor: number;
    bonus_coeff: number;
    is_deleted: boolean;
    last_modified_id?: string;
}