import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class DataService {
    private supabase: SupabaseClient;

    constructor() {
        // Используем ваши ключи Supabase (оставлены оригинальные для примера, замените при необходимости)
        this.supabase = createClient('https://oogaeuovqapmayexrnav.supabase.co', 'sb_publishable_Mc1OcPX7i3v9SLEoHaentQ_zlhzij8m');
    }

    async getDepartments() {
        const { data } = await this.supabase
            .from('departments')
            .select('*')
            .eq('is_deleted', false)
            .order('name');
        return data || [];
    }

    async getEmployees() {
        const { data } = await this.supabase
            .from('employees')
            .select(`*, department:departments!department_id(name)`)
            .eq('is_deleted', false)
            .order('last_name');
        return data || [];
    }

    async delete(table: string, id: string) {
        return await this.supabase
            .from(table)
            .update({ is_deleted: true })
            .eq('id', id);
    }

    async save(table: string, item: any) {
        if (item.id) {
            const oldId = item.id;
            await this.supabase.from(table).update({ is_deleted: true }).eq('id', oldId);
            const { id, department, ...newData } = item;
            const payload = { ...newData, is_deleted: false, last_modified_id: oldId };
            return await this.supabase.from(table).insert(payload).select();
        } else {
            return await this.supabase.from(table).insert(item).select();
        }
    }

    async deleteMultiple(table: string, ids: string[]) {
        return await this.supabase.from(table).update({ is_deleted: true }).in('id', ids);
    }
}