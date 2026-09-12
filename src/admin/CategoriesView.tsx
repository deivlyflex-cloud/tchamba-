import React, { useState, useEffect } from 'react';
import { dbService } from '../lib/dbService';
import { CategoryRecord } from '../types';
import { Plus, Edit2, Trash2, Eye, EyeOff, X, AlertTriangle } from 'lucide-react';

export const CategoriesView: React.FC = () => {
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryRecord | null>(null);
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    const data = await dbService.getCategories();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormName('');
    setFormSlug('');
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CategoryRecord) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingCategory) {
      await dbService.updateCategory(editingCategory.id, {
        name: formName.trim(),
        slug: formSlug.trim() || formName.toLowerCase().replace(/\s+/g, '-'),
      });
    } else {
      await dbService.createCategory(
        formName.trim(),
        formSlug.trim() || formName.toLowerCase().replace(/\s+/g, '-')
      );
    }

    setIsModalOpen(false);
    fetchCategories();
  };

  const handleToggleActive = async (cat: CategoryRecord) => {
    const newActive = !cat.is_active;
    await dbService.updateCategory(cat.id, { is_active: newActive });
    setCategories((prev) =>
      prev.map((c) => (c.id === cat.id ? { ...c, is_active: newActive } : c))
    );
  };

  const handleDelete = async (id: string) => {
    await dbService.deleteCategory(id);
    setDeleteConfirmId(null);
    fetchCategories();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl sm:text-2xl font-black text-white">
            Categorias do Cardápio
          </h2>
          <span className="text-xs text-[#ab8985]">
            Gerir secções de exibição de produtos (Combos, Cheese Drums, Bebidas, etc.)
          </span>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#d32f2f] hover:bg-[#b71c1c] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#d32f2f]/30 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>ADICIONAR CATEGORIA</span>
        </button>
      </div>

      <div className="bg-[#1c1b1b] border border-[#2a2a2a] rounded-3xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-[#ab8985]">Carregando categorias...</div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#ab8985]">Nenhuma categoria encontrada.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-white">
              <thead className="bg-[#131313] text-[#ab8985] uppercase tracking-wider font-bold text-[10px] border-b border-[#2a2a2a]">
                <tr>
                  <th className="px-5 py-3.5">Nome</th>
                  <th className="px-5 py-3.5">Identificador (Slug)</th>
                  <th className="px-5 py-3.5">Estado</th>
                  <th className="px-5 py-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a2a]/60">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-[#201f1f] transition-colors">
                    <td className="px-5 py-3.5 font-bold text-white">{cat.name}</td>
                    <td className="px-5 py-3.5 font-mono text-xs text-[#ffb95f]">{cat.slug}</td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => handleToggleActive(cat)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                          cat.is_active
                            ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60'
                            : 'bg-red-950/40 text-red-400 border-red-800/60'
                        }`}
                      >
                        {cat.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{cat.is_active ? 'Ativa' : 'Inativa'}</span>
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-1.5 rounded-lg bg-[#2a2a2a] hover:bg-[#353534] text-white transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(cat.id)}
                          className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/50 text-red-400 border border-red-900/40 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#1c1b1b] border border-[#2a2a2a] rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#2a2a2a] mb-5">
              <h3 className="font-heading text-lg font-extrabold text-white">
                {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#2a2a2a] hover:bg-[#353534] flex items-center justify-center text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#ab8985] mb-1.5">
                  Nome da Categoria *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Combos"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#131313] border border-[#2a2a2a] text-white text-xs focus:outline-none focus:border-[#ffb95f]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#ab8985] mb-1.5">
                  Slug (identificador)
                </label>
                <input
                  type="text"
                  placeholder="ex: combos"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#131313] border border-[#2a2a2a] text-white text-xs focus:outline-none focus:border-[#ffb95f]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-[#2a2a2a]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#2a2a2a] text-xs font-bold text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#d32f2f] hover:bg-[#b71c1c] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Guardar Categoria
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#1c1b1b] border border-[#2a2a2a] rounded-3xl p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-950/40 border border-red-800/60 flex items-center justify-center text-red-400 mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-lg font-extrabold text-white">
              Excluir categoria?
            </h3>
            <p className="text-xs text-[#ab8985] mt-2 leading-relaxed">
              Tem certeza que deseja excluir esta categoria? Os produtos associados poderão ter a categoria redefinida.
            </p>
            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#2a2a2a]">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-[#2a2a2a] text-xs font-bold text-white cursor-pointer"
              >
                CANCELAR
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-5 py-2 rounded-xl bg-[#d32f2f] hover:bg-[#b71c1c] text-xs font-bold text-white uppercase tracking-wider cursor-pointer"
              >
                EXCLUIR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
