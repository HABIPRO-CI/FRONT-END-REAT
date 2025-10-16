import React, { useState } from 'react';
import { X, User, Home, DollarSign, FileText } from 'lucide-react';

const TenantFormModal = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('personal');
    const [formData, setFormData] = useState({
        // Informations personnelles
        fullName: '',
        phone: '',
        email: '',
        idNumber: '',

        // Informations du logement
        linkedProperty: '',
        leaseStartDate: '',
        leaseEndDate: '',

        // Conditions financières
        monthlyRent: '',
        securityDeposit: '',
        paymentMethod: '',

        // Documents
        signedContract: null,
        idDocument: null,

        // Autres informations
        additionalNotes: ''
    });

    const [errors, setErrors] = useState({});

    // Données simulées - à remplacer par vos vraies données
    const availableProperties = [
        'Villa 4 pièces à Cocody',
        'Appartement 2 chambres à Plateau',
        'Studio meublé à Marcory',
        'Duplex 3 chambres à Riviera',
        'Maison 5 pièces à Deux-Plateaux'
    ];

    const paymentMethods = [
        'Mobile Money',
        'Virement bancaire',
        'Espèces',
        'Chèque',
        'Orange Money',
        'MTN Money'
    ];

    const securityDepositOptions = [
        '1 mois de loyer',
        '2 mois de loyer',
        'Montant personnalisé'
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
        setFormData(prev => ({
            ...prev,
            [name]: files[0] || null
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        // Champs obligatoires
        if (!formData.fullName.trim()) newErrors.fullName = 'Le nom complet est obligatoire';
        if (!formData.phone.trim()) newErrors.phone = 'Le téléphone est obligatoire';
        if (!formData.linkedProperty) newErrors.linkedProperty = 'La propriété liée est obligatoire';
        if (!formData.monthlyRent.trim()) newErrors.monthlyRent = 'Le montant du loyer est obligatoire';
        if (!formData.leaseStartDate) newErrors.leaseStartDate = 'La date de début de bail est obligatoire';

        // Validation du format téléphone (basique)
        const phoneRegex = /^[0-9\s\-\+\(\)]+$/;
        if (formData.phone && !phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Format de téléphone invalide';
        }

        // Validation email (si rempli)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = 'Format d\'email invalide';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            console.log('Données du locataire:', formData);
            alert('Locataire enregistré avec succès !');
            onClose();
            resetForm();
            // Ici vous pourriez envoyer les données à votre API
        } else {
            alert('Veuillez corriger les erreurs dans le formulaire.');
        }
    };

    const resetForm = () => {
        setFormData({
            fullName: '', phone: '', email: '', idNumber: '',
            linkedProperty: '', leaseStartDate: '', leaseEndDate: '',
            monthlyRent: '', securityDeposit: '', paymentMethod: '',
            signedContract: null, idDocument: null, additionalNotes: ''
        });
        setErrors({});
        setActiveTab('personal');
    };

    const handleClose = () => {
        onClose();
        resetForm();
    };

    const tabs = [
        { id: 'personal', label: 'Infos personnelles', icon: User },
        { id: 'property', label: 'Logement', icon: Home },
        { id: 'financial', label: 'Conditions', icon: DollarSign },
        { id: 'documents', label: 'Documents', icon: FileText }
    ];

    if (!isOpen) return null;

    return (
        // <div className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50 p-4" onClick={handleClose}>
        <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleClose}
        >
            <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                {/* En-tête du modal */}
                <div className="bg-green-600 text-white p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <User size={24} />
                        <h2 className="text-xl font-bold">🧾 Formulaire d'ajout de locataire</h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-white hover:bg-green-700 p-1 rounded"
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
                                            ? 'border-green-500 text-green-600 bg-white'
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
                        {/* Onglet Informations personnelles */}
                        {activeTab === 'personal' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">👤 Informations personnelles</h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nom complet <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        placeholder="Ex: Kouassi Jean-Baptiste"
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.fullName ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            📞 Téléphone <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="Ex: 07 89 56 12 34"
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                        <p className="text-xs text-gray-500 mt-1">WhatsApp inclus si disponible</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            📧 Email (optionnel)
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="Ex: jean.kouassi@gmail.com"
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        🪪 Numéro de pièce d'identité
                                    </label>
                                    <input
                                        type="text"
                                        name="idNumber"
                                        value={formData.idNumber}
                                        onChange={handleInputChange}
                                        placeholder="Ex: CNI123456789 ou Passeport AB1234567"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">CNI ou Passeport</p>
                                </div>
                            </div>
                        )}

                        {/* Onglet Informations du logement */}
                        {activeTab === 'property' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">🏠 Informations du logement</h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Propriété liée <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="linkedProperty"
                                        value={formData.linkedProperty}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.linkedProperty ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    >
                                        <option value="">Sélectionner une propriété</option>
                                        {availableProperties.map(property => (
                                            <option key={property} value={property}>{property}</option>
                                        ))}
                                    </select>
                                    {errors.linkedProperty && <p className="text-red-500 text-sm mt-1">{errors.linkedProperty}</p>}
                                    <p className="text-xs text-gray-500 mt-1">Liste des biens déjà enregistrés</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            📅 Date de début de bail <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            name="leaseStartDate"
                                            value={formData.leaseStartDate}
                                            onChange={handleInputChange}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.leaseStartDate ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.leaseStartDate && <p className="text-red-500 text-sm mt-1">{errors.leaseStartDate}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            📅 Date de fin de bail (optionnel)
                                        </label>
                                        <input
                                            type="date"
                                            name="leaseEndDate"
                                            value={formData.leaseEndDate}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Laisser vide si durée indéterminée</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Onglet Conditions financières */}
                        {activeTab === 'financial' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">💰 Conditions financières</h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        💵 Montant du loyer mensuel <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="monthlyRent"
                                            value={formData.monthlyRent}
                                            onChange={handleInputChange}
                                            placeholder="Ex: 150000"
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.monthlyRent ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        <span className="absolute right-3 top-2 text-gray-500">FCFA</span>
                                    </div>
                                    {errors.monthlyRent && <p className="text-red-500 text-sm mt-1">{errors.monthlyRent}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        💰 Dépôt de garantie
                                    </label>
                                    <select
                                        name="securityDeposit"
                                        value={formData.securityDeposit}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="">Sélectionner</option>
                                        {securityDepositOptions.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        💳 Mode de paiement
                                    </label>
                                    <select
                                        name="paymentMethod"
                                        value={formData.paymentMethod}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="">Sélectionner un mode</option>
                                        {paymentMethods.map(method => (
                                            <option key={method} value={method}>{method}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Onglet Documents */}
                        {activeTab === 'documents' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">📂 Documents et notes</h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        📂 Contrat signé (facultatif)
                                    </label>
                                    <input
                                        type="file"
                                        name="signedContract"
                                        onChange={handleFileChange}
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Formats acceptés: PDF, JPG, PNG
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        🧾 Justificatif d'identité (facultatif)
                                    </label>
                                    <input
                                        type="file"
                                        name="idDocument"
                                        onChange={handleFileChange}
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        CNI, Passeport ou autre pièce d'identité
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        📝 Notes complémentaires
                                    </label>
                                    <textarea
                                        name="additionalNotes"
                                        value={formData.additionalNotes}
                                        onChange={handleInputChange}
                                        placeholder="Ex: Préférences, conditions spéciales, rappel sur les charges, etc."
                                        rows="4"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
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
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                        >
                            ✅ Enregistrer le locataire
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TenantFormModal;