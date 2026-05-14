import { Component, computed, OnInit, signal } from '@angular/core';
import { DataService } from './services/data.service';
import { Department } from './models/department';
import { Employee } from './models/employee';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SecurityUtils } from './security/security';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  activeTab = signal<'departments' | 'employees'>('departments');
  departments = signal<Department[]>([]);
  employees = signal<Employee[]>([]);
  sortKey = signal<string>('');
  sortDir = signal<number>(1);
  selectedIds = signal<Set<string>>(new Set());

  isModalOpen = false;
  editingItem: any = {};

  constructor(private dataService: DataService) { }

  async ngOnInit() {
    await this.refresh();
  }

  async refresh() {
    this.departments.set(await this.dataService.getDepartments());
    this.employees.set(await this.dataService.getEmployees());
  }

  sortedData = computed(() => {
    const tab = this.activeTab();
    const data = tab === 'departments' ? [...this.departments()] : [...this.employees()];
    const key = this.sortKey();
    const dir = this.sortDir();

    if (!key) return data;

    return data.sort((a: any, b: any) => {
      let valA = a;
      let valB = b;
      for (const k of key.split('.')) {
        valA = valA?.[k];
        valB = valB?.[k];
      }
      if (typeof valA === 'number' && typeof valB === 'number') return (valA - valB) * dir;
      if (key.toLowerCase().includes('date')) return (new Date(valA).getTime() - new Date(valB).getTime()) * dir;
      return (valA || '').toString().localeCompare((valB || '').toString()) * dir;
    });
  });

  setSort(key: string) {
    if (this.sortKey() === key) this.sortDir.update(d => -d);
    else { this.sortKey.set(key); this.sortDir.set(1); }
  }

  openModal(item: any = {}) {
    this.editingItem = { ...item };
    this.isModalOpen = true;
  }

  async save() {
    const table = this.activeTab();
    const cleanItem = SecurityUtils.sanitize(this.editingItem);
    
    const error = table === 'departments'
      ? SecurityUtils.validateDepartment(cleanItem)
      : SecurityUtils.validateEmployee(cleanItem);

    if (error) { alert(error); return; }

    const { department, ...payload } = cleanItem;
    await this.dataService.save(table, payload);
    this.isModalOpen = false;
    await this.refresh();
  }

  async deleteItem(id: string | undefined) {
    if (!id) return;
    if (confirm('Удалить запись?')) {
      await this.dataService.delete(this.activeTab(), id);
      await this.refresh();
    }
  }

  toggleSelection(id: string) {
    this.selectedIds.update(set => {
      const newSet = new Set(set);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  }

  async deleteSelected() {
    const ids = Array.from(this.selectedIds());
    if (confirm(`Удалить ${ids.length} записей?`)) {
      await this.dataService.deleteMultiple(this.activeTab(), ids);
      this.selectedIds.set(new Set());
      await this.refresh();
    }
  }

  resetSelection() { this.selectedIds.set(new Set()); }

  asDept(item: any): Department { return item as Department; }
  asEmp(item: any): Employee { return item as Employee; }
}