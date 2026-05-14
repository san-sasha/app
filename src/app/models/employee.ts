export interface Employee {
    id: string;
    last_name: string;
    first_name: string;
    middle_name: string;
    position: string;
    hire_date: string;
    serial_number: number;
    salary: number;
    department_id: string;
    is_deleted: boolean;
    last_modified_id?: string;
    department?: { name: string }; // Для отображения в таблице
}