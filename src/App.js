import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from 'react';
import { Home, Users, FileText, DollarSign, Wrench, Receipt, Calendar, Brain, MessageCircle, Scale, TrendingUp, Clock, Shield, Zap, CheckCircle, Star, ChevronRight, Play, Menu, X, Mail, Phone, Linkedin, Facebook, Twitter, Building2, User } from 'lucide-react';
import Proprietaire from "./proprietaire/proprietaire";
import Locataire from "./locataire/loacataire";

// Composant Landing Page intégré
function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: Home,
      title: '💼 Gestion des Propriétés',
      description: 'Ajoutez, modifiez et suivez tous vos biens immobiliers (villas, studios, bureaux, appartements).',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Users,
      title: '👥 Locataires',
      description: 'Centralisez les informations, contrats et paiements de chaque locataire avec alertes automatiques.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: FileText,
      title: '📄 Contrats & Documents',
      description: 'Créez, signez et stockez vos contrats de bail ou avenants en toute sécurité.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: DollarSign,
      title: '💰 Revenus & Paiements',
      description: 'Suivez les paiements reçus, les impayés et les revenus totaux par propriété.',
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      icon: Wrench,
      title: '🔧 Maintenance',
      description: 'Suivez les réparations et les interventions techniques avec les prestataires.',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: Receipt,
      title: '🧾 Factures & Quittances',
      description: 'Générez automatiquement vos quittances de loyer ou factures PDF.',
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: Calendar,
      title: '📅 Calendrier intelligent',
      description: 'Vision globale sur les échéances, les paiements, et les rendez-vous importants.',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      icon: Brain,
      title: '🧠 IA & Automatisation',
      description: 'Suggestions automatiques (renouvellement, rappel de paiement, analyse de rentabilité).',
      color: 'from-violet-500 to-violet-600'
    },
    {
      icon: MessageCircle,
      title: '💬 Messagerie intégrée',
      description: 'Échangez directement avec vos locataires, prestataires ou gestionnaires.',
      color: 'from-cyan-500 to-cyan-600'
    },
    {
      icon: Scale,
      title: '⚖️ Base Réglementaire',
      description: 'Accédez à toutes les lois et réglementations immobilières locales à jour.',
      color: 'from-amber-500 to-amber-600'
    }
  ];

  const testimonials = [
    {
      text: "Depuis que j'utilise Habipro Gestion, je gère mes 10 locataires sans stress.",
      author: 'Jean',
      role: 'Propriétaire à Abidjan',
      avatar: '👨‍💼'
    },
    {
      text: "L'IA m'envoie un rappel avant chaque échéance, plus de retard de paiement !",
      author: 'Mariam',
      role: 'Locataire à Cocody',
      avatar: '👩‍💼'
    },
    {
      text: "La meilleure solution pour gérer mon portefeuille immobilier de manière professionnelle.",
      author: 'Kouassi',
      role: 'Gestionnaire à Yopougon',
      avatar: '👨‍💻'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                HABIPRO GESTION
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">À propos</a>
              <a href="#profiles" className="text-gray-600 hover:text-blue-600 transition-colors">Profils</a>
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Fonctionnalités</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
              <button 
                onClick={() => navigate('/proprietaire')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Commencer
              </button>
            </div>

            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-4 space-y-3">
              <a href="#about" className="block text-gray-600 hover:text-blue-600">À propos</a>
              <a href="#profiles" className="block text-gray-600 hover:text-blue-600">Profils</a>
              <a href="#features" className="block text-gray-600 hover:text-blue-600">Fonctionnalités</a>
              <a href="#contact" className="block text-gray-600 hover:text-blue-600">Contact</a>
              <button 
                onClick={() => navigate('/proprietaire')}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-medium"
              >
                Commencer
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                Propulsé par l'Intelligence Artificielle
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Gérez vos biens immobiliers avec l'
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> intelligence artificielle</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Une solution complète pour propriétaires, locataires et gestionnaires : simplifiez la gestion, automatisez vos tâches et gagnez du temps.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => navigate('/proprietaire')}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all flex items-center gap-2 text-lg"
                >
                  🚀 Essayer gratuitement
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button className="bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2 border-2 border-gray-200 text-lg">
                  <Play className="w-5 h-5" />
                  🎥 Voir la démo
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6 transform hover:scale-105 transition-transform duration-500">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-6 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-bold text-lg">Tableau de bord</h3>
                    <Brain className="w-8 h-8 text-white animate-pulse" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                      <p className="text-white/80 text-xs">Propriétés</p>
                      <p className="text-white font-bold text-xl">12</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                      <p className="text-white/80 text-xs">Locataires</p>
                      <p className="text-white font-bold text-xl">48</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                      <p className="text-white/80 text-xs">Revenus</p>
                      <p className="text-white font-bold text-xl">8.5M</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                      <p className="text-white/80 text-xs">Taux</p>
                      <p className="text-white font-bold text-xl">96%</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-700">Paiement reçu - Villa Cocody</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-700">Rappel échéance - Studio Marcory</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Choisir son Profil - NOUVEAU */}
      <section id="profiles" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">👤 Choisissez votre profil</h2>
            <p className="text-xl text-gray-600">Accédez à votre espace personnalisé en un clic</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Carte Propriétaire */}
            <div 
              onClick={() => navigate('/proprietaire')}
              className="group cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-10 hover:shadow-2xl transition-all border-2 border-blue-200 hover:border-blue-400 hover:scale-105 transform duration-300"
            >
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Building2 className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">🏠 Propriétaire</h3>
                <p className="text-gray-600 mb-6">
                  Gérez vos biens, suivez vos revenus, et communiquez avec vos locataires facilement.
                </p>
                <div className="space-y-2 text-left mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Suivi des loyers et paiements
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Gestion des contrats
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Tableaux de bord détaillés
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Alertes automatiques
                  </div>
                </div>
                <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2 text-lg">
                  Accéder à mon espace
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Carte Locataire */}
            <div 
              onClick={() => navigate('/Locataire')}
              className="group cursor-pointer bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-10 hover:shadow-2xl transition-all border-2 border-purple-200 hover:border-purple-400 hover:scale-105 transform duration-300"
            >
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">👥 Locataire</h3>
                <p className="text-gray-600 mb-6">
                  Payez votre loyer, accédez à vos documents et contactez votre propriétaire en ligne.
                </p>
                <div className="space-y-2 text-left mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Paiement en ligne sécurisé
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Accès aux documents
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Demandes de maintenance
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Messagerie directe
                  </div>
                </div>
                <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-xl font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2 text-lg">
                  Accéder à mon espace
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* À propos */}
      <section id="about" className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">🏢 Qu'est-ce que Habipro Gestion ?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              HABIPRO GESTION est une application web et mobile de gestion immobilière intelligente qui centralise tous vos biens, contrats, locataires, paiements et documents administratifs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 hover:shadow-xl transition-all border border-gray-200">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mb-4">
                <Home className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">🏠 Les propriétaires</h3>
              <p className="text-gray-600">Suivez leurs loyers, contrats et revenus en temps réel avec des tableaux de bord intuitifs.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 hover:shadow-xl transition-all border border-gray-200">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">👥 Les locataires</h3>
              <p className="text-gray-600">Payez facilement, accédez à leurs documents et recevez des rappels automatiques.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 hover:shadow-xl transition-all border border-gray-200">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">🧰 Les gestionnaires</h3>
              <p className="text-gray-600">Automatisez les tâches et améliorez la rentabilité avec l'intelligence artificielle.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">🧮 Fonctionnalités principales</h2>
            <p className="text-xl text-gray-600">Tout ce dont vous avez besoin pour une gestion immobilière moderne</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 hover:shadow-xl transition-all border border-gray-200 group">
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">💬 Ce que disent nos utilisateurs</h2>
            <p className="text-xl text-gray-600">Rejoignez des centaines de propriétaires satisfaits</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all">
                <div className="text-6xl mb-4">{testimonial.avatar}</div>
                <p className="text-gray-700 italic mb-4">"{testimonial.text}"</p>
                <div>
                  <p className="font-bold text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 px-4 bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">📞 Besoin d'aide ?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Vous avez besoin d'aide ou d'une démo personnalisée ? Chattez avec un Expert HABIPRO ou écrivez à support@habipro.ci
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all flex items-center gap-2">
              <Mail className="w-5 h-5" />
              📩 Contacter le support
            </button>
            <button className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all border-2 border-white/30 flex items-center gap-2">
              <Phone className="w-5 h-5" />
              📞 Demander un rappel
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <span className="text-white font-bold text-lg">HABIPRO</span>
              </div>
              <p className="text-sm text-gray-400">L'immobilier intelligent à portée de main.</p>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Liens rapides</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#about" className="hover:text-white transition-colors">À propos</a></li>
                <li><a href="#profiles" className="hover:text-white transition-colors">Profils</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Fonctionnalités</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Légal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Mentions légales</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Confidentialité</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Conditions d'utilisation</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Suivez-nous</h3>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-sm text-gray-400">© 2025 HABIPRO GESTION - Tous droits réservés</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Composant Navigation
function Navigation() {
  const location = useLocation();
  
  // Masquer la nav sur toutes les pages sauf les pages spécifiques
  if (location.pathname === "/" || location.pathname === "/proprietaire" || location.pathname === "/Locataire") {
    return null;
  }
  
  return null; // Pas de navigation pour l'instant sur les autres pages
}

// Composant App principal
function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        {/* Landing Page - Page d'accueil */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Vos routes existantes */}
        <Route path="/proprietaire" element={<Proprietaire />} />
        <Route path="/Locataire" element={<Locataire />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;