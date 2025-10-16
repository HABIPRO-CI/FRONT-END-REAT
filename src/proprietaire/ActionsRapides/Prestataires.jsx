import React, { useState } from 'react';
import { X, User, Phone, Mail, Globe, Wrench, MapPin, DollarSign, Camera, FileText, Upload, Eye } from 'lucide-react';

const NouveauPrestataireModal = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('info');
    const [formData, setFormData] = useState({
        // Informations du prestataire
        name: '',
        phone: '',
        email: '',
        website: '',

        // Spécialité
        category: '',
        description: '',

        // Zone d'intervention
        city: '',
        coverageArea: '',

        // Tarification
        pricing: '',

        // Documents / Médias
        photo: null,
        certifications: []
    });

    const [errors, setErrors] = useState({});
    const [dragOver, setDragOver] = useState(false);

    const categories = [
        'Plomberie',
        'Électricité',
        'Maçonnerie',
        'Nettoyage',
        'Aménagement intérieur',
        'Sécurité',
        'Jardinage',
        'Peinture',
        'Climatisation',
        'Menuiserie',
        'Carrelage',
        'Autre'
    ];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Supprimer l'erreur si le champ est maintenant rempli
        if (errors[name] && value.trim() !== '') {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (name === 'photo') {
            setFormData(prev => ({
                ...prev,
                photo: files[0] || null
            }));
        } else if (name === 'certifications') {
            setFormData(prev => ({
                ...prev,
                certifications: [...prev.certifications, ...Array.from(files)]
            }));
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const files = Array.from(e.dataTransfer.files);
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        if (imageFiles.length > 0) {
            setFormData(prev => ({
                ...prev,
                photo: imageFiles[0]
            }));
        }
    };

    const removeCertification = (index) => {
        setFormData(prev => ({
            ...prev,
            certifications: prev.certifications.filter((_, i) => i !== index)
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        // Champs obligatoires
        if (!formData.name.trim()) newErrors.name = 'Le nom est obligatoire';
        if (!formData.phone.trim()) newErrors.phone = 'Le téléphone est obligatoire';
        if (!formData.category) newErrors.category = 'La catégorie est obligatoire';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            console.log('Données du prestataire:', formData);
            alert('Prestataire enregistré avec succès !');
            onClose();
            resetForm();
            // Ici vous pourriez envoyer les données à votre API
        } else {
            alert('Veuillez corriger les erreurs dans le formulaire.');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '', phone: '', email: '', website: '',
            category: '', description: '', city: '', coverageArea: '',
            pricing: '', photo: null, certifications: []
        });
        setErrors({});
        setActiveTab('info');
    };

    const handleClose = () => {
        onClose();
        resetForm();
    };

    const tabs = [
        { id: 'info', label: 'Informations', icon: User },
        { id: 'speciality', label: 'Spécialité', icon: Wrench },
        { id: 'zone', label: 'Zone', icon: MapPin },
        { id: 'pricing', label: 'Tarification', icon: DollarSign },
        { id: 'media', label: 'Documents', icon: Camera },
        { id: 'preview', label: 'Aperçu', icon: Eye }
    ];

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleClose}
        >
            <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                {/* En-tête du modal */}
                <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Wrench size={24} />
                        <h2 className="text-xl font-bold">🛠️ Ajouter un Prestataire</h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-white hover:bg-blue-700 p-1 rounded"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Navigation par onglets */}
                <div className="border-b bg-gray-50">
                    <nav className="flex overflow-x-auto">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 py-3 px-4 whitespace-nowrap border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600 bg-white'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    <Icon size={16} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Contenu du formulaire */}
                <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
                    <div className="p-6">
                        {/* Onglet Informations */}
                        {activeTab === 'info' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">👤 Informations du prestataire</h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        👤 Nom du prestataire / Entreprise <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Ex: Kouadio Plomberie Services"
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            📞 Téléphone / WhatsApp <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="Ex: +225 07 12 34 56 78"
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            📧 Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="Ex: contact@prestataire.com"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        🌐 Site web / Réseaux sociaux
                                    </label>
                                    <input
                                        type="url"
                                        name="website"
                                        value={formData.website}
                                        onChange={handleInputChange}
                                        placeholder="Ex: www.prestataire.com ou @facebook"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Onglet Spécialité */}
                        {activeTab === 'speciality' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">🛠️ Spécialité</h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        🛠️ Catégorie <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.category ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    >
                                        <option value="">Sélectionner une catégorie</option>
                                        {categories.map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                    {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        📖 Description des services
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Ex: Installation chauffe-eau, dépannage plomberie, réparation fuites..."
                                        rows="5"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Décrivez en détail les services proposés</p>
                                </div>
                            </div>
                        )}

                        {/* Onglet Zone d'intervention */}
                        {activeTab === 'zone' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">📍 Zone d'intervention</h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        📍 Ville / Quartier principal
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        placeholder="Ex: Abidjan, Cocody"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        🚗 Zone couverte
                                    </label>
                                    <textarea
                                        name="coverageArea"
                                        value={formData.coverageArea}
                                        onChange={handleInputChange}
                                        placeholder="Ex: Abidjan et environs, Cocody, Marcory, Plateau, Yopougon"
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Précisez tous les quartiers ou villes desservies</p>
                                </div>
                            </div>
                        )}

                        {/* Onglet Tarification */}
                        {activeTab === 'pricing' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">💵 Tarification</h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        💵 Tarif moyen / horaire ou forfaitaire
                                    </label>
                                    <input
                                        type="text"
                                        name="pricing"
                                        value={formData.pricing}
                                        onChange={handleInputChange}
                                        placeholder="Ex: 5000 FCFA/heure, Devis gratuit, À partir de 15000 FCFA"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Indiquez vos tarifs ou mentionnez "Devis sur demande"</p>
                                </div>
                            </div>
                        )}

                        {/* Onglet Documents / Médias */}
                        {activeTab === 'media' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">📷 Documents / Médias</h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        📷 Photo / Logo du prestataire
                                    </label>
                                    <div
                                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        onClick={() => document.getElementById('photo-input').click()}
                                    >
                                        <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                                        <p className="text-gray-600 mb-2">Glissez-déposez votre photo ici ou cliquez pour sélectionner</p>
                                        <p className="text-sm text-gray-500">PNG, JPG, JPEG jusqu'à 10MB</p>
                                        <input
                                            id="photo-input"
                                            type="file"
                                            name="photo"
                                            onChange={handleFileChange}
                                            accept=".jpg,.jpeg,.png"
                                            className="hidden"
                                        />
                                    </div>

                                    {formData.photo && (
                                        <div className="mt-4">
                                            <img
                                                src={URL.createObjectURL(formData.photo)}
                                                alt="Photo du prestataire"
                                                className="w-32 h-32 object-cover rounded-lg"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        📂 Certifications ou attestations
                                    </label>
                                    <input
                                        type="file"
                                        name="certifications"
                                        onChange={handleFileChange}
                                        multiple
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">PDF, JPG, PNG - Optionnel</p>

                                    {/* Aperçu des certifications */}
                                    {formData.certifications.length > 0 && (
                                        <div className="grid grid-cols-2 gap-4 mt-4">
                                            {formData.certifications.map((cert, index) => (
                                                <div key={index} className="relative border rounded p-2">
                                                    <p className="text-sm text-gray-600 truncate">{cert.name}</p>
                                                    <button
                                                        onClick={() => removeCertification(index)}
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Onglet Aperçu */}
                        {activeTab === 'preview' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">👁️ Aperçu du prestataire</h3>

                                <div className="bg-gray-50 p-6 rounded-lg border">
                                    <div className="bg-white p-4 rounded-lg shadow">
                                        <div className="flex items-start gap-4 mb-4">
                                            {formData.photo && (
                                                <img
                                                    src={URL.createObjectURL(formData.photo)}
                                                    alt="Photo du prestataire"
                                                    className="w-16 h-16 object-cover rounded-lg"
                                                />
                                            )}
                                            <div className="flex-1">
                                                <h4 className="text-xl font-bold text-gray-800 mb-2">
                                                    {formData.name || 'Nom du prestataire'}
                                                </h4>
                                                {formData.category && (
                                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                                                        {formData.category}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {formData.description && (
                                            <div className="mb-4">
                                                <h5 className="font-medium text-gray-800 mb-2">Services proposés</h5>
                                                <p className="text-gray-600 text-sm">{formData.description}</p>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                            <div>
                                                <h5 className="font-medium text-gray-800 mb-2">Contact</h5>
                                                {formData.phone && <p className="text-gray-600 mb-1">📞 {formData.phone}</p>}
                                                {formData.email && <p className="text-gray-600 mb-1">📧 {formData.email}</p>}
                                                {formData.website && <p className="text-gray-600">🌐 {formData.website}</p>}
                                            </div>
                                            <div>
                                                <h5 className="font-medium text-gray-800 mb-2">Zone d'intervention</h5>
                                                {formData.city && <p className="text-gray-600 mb-1">📍 {formData.city}</p>}
                                                {formData.coverageArea && <p className="text-gray-600 text-xs">{formData.coverageArea}</p>}
                                            </div>
                                        </div>

                                        {formData.pricing && (
                                            <div className="mb-4">
                                                <h5 className="font-medium text-gray-800 mb-2">Tarification</h5>
                                                <p className="text-blue-600 font-medium">💵 {formData.pricing}</p>
                                            </div>
                                        )}

                                        {formData.certifications.length > 0 && (
                                            <div>
                                                <h5 className="font-medium text-gray-800 mb-2">Documents</h5>
                                                <p className="text-sm text-gray-600">📂 {formData.certifications.length} certification(s) disponible(s)</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Boutons d'action */}
                    <div className="border-t bg-gray-50 px-6 py-4 flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                        >
                            ❌ Annuler
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                        >
                            ✅ Enregistrer le prestataire
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NouveauPrestataireModal;