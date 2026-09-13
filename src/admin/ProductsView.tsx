import React, { useState, useEffect } from 'react';
import { dbService } from '../lib/dbService';
import { Product, Category } from '../types';
import { FORMAT_KZ } from '../data/products';
import { Plus, Edit2, Trash2, Check, X, Upload, Star, Eye, EyeOff, AlertTriangle, Image as ImageIcon } from 'lucide-react';

export const ProductsView: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [modalError, setModalError] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState<number>(0);
  const [formCategory, setFormCategory] = useState<Exclude<Category, 'Todos'>>('Combos');
  const [formPieces, setFormPieces] = useState('');
  const [formBadge, setFormBadge] = useState('');
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formIsActive, setFormIsActive] = useState(true);
  const [formIsConsultation, setFormIsConsultation] = useState(false);
  const [formImageUrl, setFormImageUrl] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    const data = await dbService.getProducts(false); // get both active and inactive
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormDescription('');
    setFormPrice(0);
    setFormCategory('Combos');
    setFormPieces('');
    setFormBadge('');
    setFormIsFeatured(false);
    setFormIsActive(true);
    setFormIsConsultation(false);
    setFormImageUrl('');
    setImageFile(null);
    setImagePreview('');
    setModalError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormDescription(p.description);
    setFormPrice(p.price);
    setFormCategory(p.category);
    setFormPieces(p.pieces || '');
    setFormBadge(p.badge || '');
    setFormIsFeatured(Boolean(p.isFeatured));
    setFormIsActive(p.isActive !== false);
    setFormIsConsultation(Boolean(p.isConsultation));
    setFormImageUrl(p.image);
    setImageFile(null);
    setImagePreview(p.image);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setModalError(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setModalError(null);

    let finalImageUrl = formImageUrl;

    // Upload image to Supabase Storage if a new file was chosen
    if (imageFile) {
      console.log('[ProductsView] Uploading image file to Supabase...');
      const { url, error: uploadErr } = await dbService.uploadProductImage(imageFile);
      if (uploadErr || !url) {
        setModalError(uploadErr || 'Falha ao enviar imagem. Verifique a conexão com o Supabase.');
        setActionLoading(false);
        return;
      }
      finalImageUrl = url;
    }

    const payload: Partial<Product> = {
      name: formName.trim(),
      description: formDescription.trim(),
      price: Number(formPrice) || 0,
      category: formCategory,
      pieces: formPieces.trim() || undefined,
      badge: formBadge.trim() || undefined,
      image: finalImageUrl,
      isFeatured: formIsFeatured,
      isActive: formIsActive,
      isConsultation: formIsConsultation,
    };

    console.log('[ProductsView] Saving product to Supabase:', payload);
    let saveResult: { error: string | null };

    if (editingProduct) {
      saveResult = await dbService.updateProduct(editingProduct.id, payload);
    } else {
      saveResult = await dbService.createProduct(payload);
    }

    if (saveResult.error) {
      setModalError(saveResult.error);
      setActionLoading(false);
      return;
    }

    setFeedbackMessage({
      type: 'success',
      text: editingProduct ? 'Produto atualizado com sucesso no Supabase!' : 'Produto criado com sucesso no Supabase!',
    });
    setTimeout(() => setFeedbackMessage(null), 5000);

    setActionLoading(false);
    setIsModalOpen(false);
    await fetchProducts();
  };

  const handleToggleActive = async (p: Product) => {
    const newActiveState = !p.isActive;
    const { error } = await dbService.updateProduct(p.id, { isActive: newActiveState });
    if (error) {
      setFeedbackMessage({ type: 'error', text: `Erro ao alterar estado: ${error}` });
      setTimeout(() => setFeedbackMessage(null), 5000);
      return;
    }
    setProducts((prev) =>
      prev.map((item) => (item.id === p.id ? { ...item, isActive: newActiveState } : item))
    );
  };

  const handleToggleFeatured = async (p: Product) => {
    const newFeaturedState = !p.isFeatured;
    const { error } = await dbService.updateProduct(p.id, { isFeatured: newFeaturedState });
    if (error) {
      setFeedbackMessage({ type: 'error', text: `Erro ao alterar destaque: ${error}` });
      setTimeout(() => setFeedbackMessage(null), 5000);
      return;
    }
    setProducts((prev) =>
      prev.map((item) => (item.id === p.id ? { ...item, isFeatured: newFeaturedState } : item))
    );
  };

  const handleDelete = async (id: string) => {
    const { error } = await dbService.deleteProduct(id);
    setDeleteConfirmId(null);
    if (error) {
      setFeedbackMessage({ type: 'error', text: `Erro ao excluir produto: ${error}` });
      setTimeout(() => setFeedbackMessage(null), 5000);
      return;
    }
    setFeedbackMessage({ type: 'success', text: 'Produto excluído com sucesso do Supabase!' });
    setTimeout(() => setFeedbackMessage(null), 5000);
    await fetchProducts();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl sm:text-2xl font-black text-white">
            Gestão de Produtos
          </h2>
          <span className="text-xs text-[#ab8985]">
            Adicione, edite preços, faça upload de fotos e altere a visibilidade no site público
          </span>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#d32f2f] hover:bg-[#b71c1c] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#d32f2f]/30 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>ADICIONAR PRODUTO</span>
        </button>
      </div>

      {/* Feedback Banner */}
      {feedbackMessage && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between text-xs font-semibold ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
              : 'bg-red-950/60 border border-red-800 text-red-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedbackMessage.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-400" />
            )}
            <span>{feedbackMessage.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-white/60 hover:text-white cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-[#1c1b1b] border border-[#2a2a2a] rounded-3xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-[#ab8985]">
            Carregando produtos...
          </div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#ab8985]">
            Nenhum produto encontrado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-white">
              <thead className="bg-[#131313] text-[#ab8985] uppercase tracking-wider font-bold text-[10px] border-b border-[#2a2a2a]">
                <tr>
                  <th className="px-5 py-3.5">Produto</th>
                  <th className="px-5 py-3.5">Categoria</th>
                  <th className="px-5 py-3.5">Preço</th>
                  <th className="px-5 py-3.5">Destaque</th>
                  <th className="px-5 py-3.5">Estado</th>
                  <th className="px-5 py-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a2a]/60">
                {products.map((product) => {
                  const isActive = product.isActive !== false;
                  return (
                    <tr key={product.id} className="hover:bg-[#201f1f] transition-colors">
                      <td className="px-5 py-3.5 flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-[#131313] border border-[#2a2a2a] overflow-hidden shrink-0 flex items-center justify-center">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-[#ab8985]" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-white block truncate max-w-[200px]">
                            {product.name}
                          </span>
                          <span className="text-[11px] text-[#ab8985] block truncate max-w-[240px]">
                            {product.description}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-3.5 text-[#ffb95f] font-medium">
                        {product.category}
                      </td>

                      <td className="px-5 py-3.5 font-heading font-extrabold text-white whitespace-nowrap">
                        {product.isConsultation && product.price === 0
                          ? 'Sob Consulta'
                          : FORMAT_KZ(product.price)}
                      </td>

                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => handleToggleFeatured(product)}
                          title="Alternar destaque"
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            product.isFeatured
                              ? 'bg-[#ffb95f]/20 border-[#ffb95f]/40 text-[#ffb95f]'
                              : 'bg-[#131313] border-[#2a2a2a] text-[#ab8985] hover:text-white'
                          }`}
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>
                      </td>

                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => handleToggleActive(product)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60'
                              : 'bg-red-950/40 text-red-400 border-red-800/60'
                          }`}
                        >
                          {isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{isActive ? 'Ativo' : 'Inativo'}</span>
                        </button>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-1.5 rounded-lg bg-[#2a2a2a] hover:bg-[#353534] text-white transition-colors cursor-pointer"
                            title="Editar produto"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(product.id)}
                            className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/50 text-red-400 border border-red-900/40 transition-colors cursor-pointer"
                            title="Excluir produto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Create or Edit Product */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-xl bg-[#1c1b1b] border border-[#2a2a2a] rounded-3xl p-6 sm:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#2a2a2a] mb-5">
              <h3 className="font-heading text-lg font-extrabold text-white">
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#2a2a2a] hover:bg-[#353534] flex items-center justify-center text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              {modalError && (
                <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-800 text-red-200 text-xs flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div className="flex-1 font-medium">{modalError}</div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#ab8985] mb-1.5">
                  Nome do Produto *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Crispy Alcides"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#131313] border border-[#2a2a2a] text-white text-xs focus:outline-none focus:border-[#ffb95f]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#ab8985] mb-1.5">
                  Descrição
                </label>
                <textarea
                  rows={2}
                  placeholder="ex: 5 Cheese Drums + Refrigerante 500ml"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#131313] border border-[#2a2a2a] text-white text-xs focus:outline-none focus:border-[#ffb95f]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#ab8985] mb-1.5">
                    Preço (Kz) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    disabled={formIsConsultation}
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#131313] border border-[#2a2a2a] text-white text-xs focus:outline-none focus:border-[#ffb95f] disabled:opacity-40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#ab8985] mb-1.5">
                    Categoria
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#131313] border border-[#2a2a2a] text-white text-xs focus:outline-none focus:border-[#ffb95f]"
                  >
                    <option value="Combos">Combos</option>
                    <option value="Cheese Drums">Cheese Drums</option>
                    <option value="Acompanhamentos">Acompanhamentos</option>
                    <option value="Bebidas">Bebidas</option>
                    <option value="Eventos">Eventos</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#ab8985] mb-1.5">
                    Porção / Peças
                  </label>
                  <input
                    type="text"
                    placeholder="ex: 5 Peças, 500ml"
                    value={formPieces}
                    onChange={(e) => setFormPieces(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#131313] border border-[#2a2a2a] text-white text-xs focus:outline-none focus:border-[#ffb95f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#ab8985] mb-1.5">
                    Selo / Badge
                  </label>
                  <input
                    type="text"
                    placeholder="ex: Mais Pedido, Popular"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#131313] border border-[#2a2a2a] text-white text-xs focus:outline-none focus:border-[#ffb95f]"
                  />
                </div>
              </div>

              {/* Image Upload / URL */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#ab8985] mb-1.5">
                  Imagem do Produto (Supabase Storage)
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#131313] border border-[#2a2a2a] overflow-hidden flex items-center justify-center shrink-0">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-[#ab8985]" />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col gap-1.5">
                    <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#2a2a2a] hover:bg-[#353534] text-white text-xs font-bold cursor-pointer w-fit transition-colors">
                      <Upload className="w-4 h-4" />
                      <span>Escolher Nova Foto</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[11px] text-[#ab8985]">
                      Armazenado no bucket seguro de imagens do Supabase
                    </span>
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-2 border-t border-[#2a2a2a] flex flex-wrap gap-4 text-xs">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="rounded border-[#2a2a2a] text-[#d32f2f]"
                  />
                  <span className="text-white font-medium">Produto Ativo no Site</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsFeatured}
                    onChange={(e) => setFormIsFeatured(e.target.checked)}
                    className="rounded border-[#2a2a2a] text-[#ffb95f]"
                  />
                  <span className="text-white font-medium">Destacar no Site Público</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsConsultation}
                    onChange={(e) => setFormIsConsultation(e.target.checked)}
                    className="rounded border-[#2a2a2a] text-[#ffb95f]"
                  />
                  <span className="text-white font-medium">Preço sob Consulta (Frango Artesanal)</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-[#2a2a2a]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#2a2a2a] text-xs font-bold text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-xl bg-[#d32f2f] hover:bg-[#b71c1c] text-white text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors"
                >
                  {actionLoading ? 'Guardando...' : 'Guardar Produto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#1c1b1b] border border-[#2a2a2a] rounded-3xl p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-950/40 border border-red-800/60 flex items-center justify-center text-red-400 mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-lg font-extrabold text-white">
              Tem certeza que deseja excluir este produto?
            </h3>
            <p className="text-xs text-[#ab8985] mt-2 leading-relaxed">
              O produto será removido permanentemente da base de dados e não será mais exibido no cardápio público.
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
