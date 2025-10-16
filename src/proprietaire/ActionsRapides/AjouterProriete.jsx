'use client';

import React, { useState } from 'react';
import { X, Home, Building, Camera, DollarSign } from 'lucide-react';

const PropertyFormModal = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('general');
    const [formData, setFormData] = useState({
        // Informations générales
        title: '',
        propertyType: '',
        address: '',
        gpsLat: '',
        gpsLng: '',

        // Caractéristiques
        surface: '',
        bedrooms: '',
        bathrooms: '',
        hasParking: false,
        hasGarden: false,
        hasBalcony: false,
        hasTerrace: false,

        // Conditions financières
        offerType: '',
        price: '',
        currency: 'FCFA',
        leaseDuration: '',

        // Multimédia
        photos: [],
        video: null,

        // Informations supplémentaires
        description: '',
        immediateAvailability: false
    });

    const [errors, setErrors] = useState({});

    const propertyTypes = [
        'Appartement',
        'Maison',
        'Villa',
        'Studio',
        'Terrain',
        'Duplex',
        'Penthouse',
        'Loft'
    ];

    const currencies = ['FCFA', 'EUR', 'USD'];

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
        if (name === 'photos') {
            setFormData(prev => ({
                ...prev,
                photos: Array.from(files)
            }));
        } else if (name === 'video') {
            setFormData(prev => ({
                ...prev,
                video: files[0] || null
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Champs obligatoires
        if (!formData.title.trim()) newErrors.title = 'Le titre est obligatoire';
        if (!formData.propertyType) newErrors.propertyType = 'Le type de bien est obligatoire';
        if (!formData.address.trim()) newErrors.address = 'L\'adresse est obligatoire';
        if (!formData.surface.trim()) newErrors.surface = 'La superficie est obligatoire';
        if (!formData.offerType) newErrors.offerType = 'Le type d\'offre est obligatoire';
        if (!formData.price.trim()) newErrors.price = 'Le prix est obligatoire';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            console.log('Données du formulaire:', formData);
            alert('Propriété enregistrée avec succès !');
            onClose();
            resetForm();
            // Ici vous pourriez envoyer les données à votre API
        } else {
            alert('Veuillez corriger les erreurs dans le formulaire.');
        }
    };

    const resetForm = () => {
        setFormData({
            title: '', propertyType: '', address: '', gpsLat: '', gpsLng: '',
            surface: '', bedrooms: '', bathrooms: '', hasParking: false,
            hasGarden: false, hasBalcony: false, hasTerrace: false,
            offerType: '', price: '', currency: 'FCFA', leaseDuration: '',
            photos: [], video: null, description: '', immediateAvailability: false
        });
        setErrors({});
        setActiveTab('general');
    };

    const handleClose = () => {
        onClose();
        resetForm();
    };

    const tabs = [
        { id: 'general', label: 'Infos générales', icon: Home },
        { id: 'features', label: 'Caractéristiques', icon: Building },
        { id: 'media', label: 'Photos', icon: Camera },
        { id: 'financial', label: 'Conditions', icon: DollarSign }
    ];

    if (!isOpen) return null;

    return (
                <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleClose}
        >            
        <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[100vh] overflow-hidden" onClick={(e) => e.stopPropagation()}> 
                {/* En-tête du modal */}
                <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Home size={24} />
                        <h2 className="text-xl font-bold">🏠 Formulaire d'ajout de propriété</h2>
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
                        {/* Onglet Informations générales */}
                        {activeTab === 'general' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">📌 Informations générales</h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Titre de la propriété <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            placeholder="ex : Villa 4 pièces à Cocody"
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            🏷️ Type de bien <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="propertyType"
                                            value={formData.propertyType}
                                            onChange={handleInputChange}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.propertyType ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        >
                                            <option value="">Sélectionner un type</option>
                                            {propertyTypes.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                        {errors.propertyType && <p className="text-red-500 text-sm mt-1">{errors.propertyType}</p>}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        📍 Adresse complète <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="Ville, Quartier, Rue..."
                                        rows="3"
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.address ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            🗺️ Latitude (optionnel)
                                        </label>
                                        <input
                                            type="text"
                                            name="gpsLat"
                                            value={formData.gpsLat}
                                            onChange={handleInputChange}
                                            placeholder="ex: 5.3364"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            🗺️ Longitude (optionnel)
                                        </label>
                                        <input
                                            type="text"
                                            name="gpsLng"
                                            value={formData.gpsLng}
                                            onChange={handleInputChange}
                                            placeholder="ex: -4.0266"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Onglet Caractéristiques */}
                        {activeTab === 'features' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">🏡 Caractéristiques du bien</h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Superficie <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="surface"
                                            value={formData.surface}
                                            onChange={handleInputChange}
                                            placeholder="ex: 120"
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.surface ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        <span className="absolute right-3 top-2 text-gray-500">m²</span>
                                    </div>
                                    {errors.surface && <p className="text-red-500 text-sm mt-1">{errors.surface}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            🛏️ Nombre de chambres
                                        </label>
                                        <input
                                            type="number"
                                            name="bedrooms"
                                            value={formData.bedrooms}
                                            onChange={handleInputChange}
                                            min="0"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            🚿 Nombre de salles de bain
                                        </label>
                                        <input
                                            type="number"
                                            name="bathrooms"
                                            value={formData.bathrooms}
                                            onChange={handleInputChange}
                                            min="0"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        🚗 Équipements disponibles
                                    </label>
                                    <div className="space-y-2">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="hasParking"
                                                checked={formData.hasParking}
                                                onChange={handleInputChange}
                                                className="mr-2"
                                            />
                                            Garage / Parking
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="hasGarden"
                                                checked={formData.hasGarden}
                                                onChange={handleInputChange}
                                                className="mr-2"
                                            />
                                            🌿 Jardin
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="hasBalcony"
                                                checked={formData.hasBalcony}
                                                onChange={handleInputChange}
                                                className="mr-2"
                                            />
                                            Balcon
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="hasTerrace"
                                                checked={formData.hasTerrace}
                                                onChange={handleInputChange}
                                                className="mr-2"
                                            />
                                            Terrasse
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Onglet Photos */}
                        {activeTab === 'media' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">📷 Multimédia</h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Photos du bien
                                    </label>
                                    <input
                                        type="file"
                                        name="photos"
                                        onChange={handleFileChange}
                                        multiple
                                        accept="image/*"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Vous pouvez sélectionner plusieurs photos
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        🎥 Vidéo ou visite virtuelle (optionnel)
                                    </label>
                                    <input
                                        type="file"
                                        name="video"
                                        onChange={handleFileChange}
                                        accept="video/*"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        📖 Description détaillée
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Décrivez les atouts du bien, proximité écoles, commerces, etc."
                                        rows="5"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="immediateAvailability"
                                            checked={formData.immediateAvailability}
                                            onChange={handleInputChange}
                                            className="mr-2"
                                        />
                                        ✅ Disponibilité immédiate
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Onglet Conditions financières */}
                        {activeTab === 'financial' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">💰 Conditions financières</h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Type d'offre <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="offerType"
                                        value={formData.offerType}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.offerType ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    >
                                        <option value="">Sélectionner</option>
                                        <option value="Vente">Vente</option>
                                        <option value="Location">Location</option>
                                    </select>
                                    {errors.offerType && <p className="text-red-500 text-sm mt-1">{errors.offerType}</p>}
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            💵 {formData.offerType === 'Location' ? 'Loyer mensuel' : 'Prix'} <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            placeholder="ex: 500000"
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.price ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Devise
                                        </label>
                                        <select
                                            name="currency"
                                            value={formData.currency}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            {currencies.map(currency => (
                                                <option key={currency} value={currency}>{currency}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {formData.offerType === 'Location' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            📅 Durée du bail
                                        </label>
                                        <select
                                            name="leaseDuration"
                                            value={formData.leaseDuration}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Sélectionner</option>
                                            <option value="6 mois">6 mois</option>
                                            <option value="12 mois">12 mois</option>
                                            <option value="24 mois">24 mois</option>
                                            <option value="Indéterminée">Durée indéterminée</option>
                                        </select>
                                    </div>
                                )}
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
                            🔘 Annuler
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                        >
                            🔘 Enregistrer la propriété
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyFormModal;