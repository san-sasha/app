export class SecurityUtils {
    static sanitize(input: any): any {
        if (input === null || input === undefined) return input;
        if (Array.isArray(input)) return input.map(item => this.sanitize(item));
        if (typeof input === 'object') {
            const sanitizedObj: any = {};
            for (const key in input) {
                if (Object.prototype.hasOwnProperty.call(input, key)) {
                    sanitizedObj[key] = this.sanitize(input[key]);
                }
            }
            return sanitizedObj;
        }
        if (typeof input !== 'string') return input;
        return input
            .replace(/\0/g, '')
            .replace(/<[^>]*>?/gm, '')
            .replace(/--+/g, '')
            .replace(/\/\*.*?\*\//g, '')
            .replace(/;/g, '')
            .replace(/['"\\`]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    static validateDepartment(data: any): string | null {
        if (!data.name || data.name.length < 2) return "Название отдела должно быть не менее 2 символов.";
        if (data.floor < -2 || data.floor > 100) return "Некорректный этаж (от -2 до 100).";
        if (data.bonus_coeff < 0 || data.bonus_coeff > 5) return "Коэффициент должен быть в диапазоне от 0 до 5.";
        return null;
    }

    static validateEmployee(data: any): string | null {
        if (!data.last_name || !data.first_name) return "Фамилия и Имя обязательны.";
        if (!data.department_id) return "Необходимо выбрать отдел.";
        if (data.salary < 0) return "Оклад не может быть отрицательным.";
        if (data.serial_number <= 0) return "Табельный номер должен быть положительным числом.";
        return null;
    }
}