from django.db import models
<<<<<<< HEAD
from django.core.validators import FileExtensionValidator
from django.db.models import Q
=======
from django.core.validators import FileExtensionValidator, MinValueValidator, RegexValidator
from django.db.models import Q
from django.utils import timezone
>>>>>>> da64587f (Initial commit - version locale du projet FRONT-END-REAT)
import os

def document_upload_path(instance, filename):
    """Génère le chemin d'upload pour les documents"""
    category_folder = instance.category
    return f'documents/{category_folder}/{filename}'

class Document(models.Model):
    """Modèle pour stocker les documents et contrats"""
    
    CATEGORY_CHOICES = [
        ('contracts', 'Contrats de bail'),
        ('inventory', 'États des lieux'),
        ('receipts', 'Quittances'),
        ('insurance', 'Assurances'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Actif'),
        ('completed', 'Terminé'),
        ('issued', 'Émis'),
        ('valid', 'Valide'),
        ('signed', 'Signé'),
    ]
    
    # Informations principales
    title = models.CharField(max_length=255, verbose_name="Titre du document")
    category = models.CharField(
        max_length=50, 
        choices=CATEGORY_CHOICES,
        verbose_name="Catégorie"
    )
    type = models.CharField(max_length=100, verbose_name="Type de document")
    description = models.TextField(blank=True, verbose_name="Description")
    content = models.TextField(blank=True, verbose_name="Contenu/Extrait")
    
    # Fichier
    file = models.FileField(
        upload_to=document_upload_path,
        validators=[FileExtensionValidator(allowed_extensions=['pdf'])],
        verbose_name="Fichier PDF"
    )
    
    # Métadonnées du fichier
    size = models.CharField(max_length=20, blank=True, verbose_name="Taille du fichier")
    pages = models.IntegerField(default=1, verbose_name="Nombre de pages")
    
    # Informations liées
    tenant = models.CharField(max_length=255, verbose_name="Locataire")
    property = models.CharField(max_length=255, verbose_name="Propriété")
    
    # Statut
    status = models.CharField(
        max_length=50,
        choices=STATUS_CHOICES,
        default='active',
        verbose_name="Statut"
    )
    
    # Dates
    date = models.DateField(verbose_name="Date du document")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Date de modification")
    
    class Meta:
        db_table = 'documents'
        ordering = ['-date', '-created_at']
        verbose_name = "Document"
        verbose_name_plural = "Documents"
    
    def __str__(self):
        return self.title
    
    def delete(self, *args, **kwargs):
        """Supprime le fichier physique lors de la suppression du document"""
        if self.file:
            if os.path.isfile(self.file.path):
                os.remove(self.file.path)
        super().delete(*args, **kwargs)
    
    def get_file_size(self):
        """Retourne la taille du fichier formatée"""
        if self.file:
            size_bytes = self.file.size
            if size_bytes < 1024:
                return f"{size_bytes} B"
            elif size_bytes < 1024 * 1024:
                return f"{size_bytes / 1024:.1f} KB"
            else:
                return f"{size_bytes / (1024 * 1024):.1f} MB"
        return "0 B"
    
    def save(self, *args, **kwargs):
        """Override save pour calculer automatiquement la taille"""
        if self.file and not self.size:
            self.size = self.get_file_size()
        super().save(*args, **kwargs)

<<<<<<< HEAD
    
=======



class Property(models.Model):
    """Modèle pour les propriétés (si pas encore créé)"""
    name = models.CharField(max_length=200, verbose_name="Nom de la propriété")
    address = models.TextField(verbose_name="Adresse", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Propriété"
        verbose_name_plural = "Propriétés"

    def __str__(self):
        return self.name


class Tenant(models.Model):
    """Modèle pour les locataires"""
    
    # Informations personnelles
    full_name = models.CharField(max_length=200, verbose_name="Nom complet")
    title = models.CharField(max_length=200, verbose_name="Titre/Profession", blank=True)
    
    # Contact
    phone_regex = RegexValidator(
        regex=r'^\+?[\d\s\-\(\)]+$',
        message="Format de téléphone invalide"
    )
    phone = models.CharField(
        validators=[phone_regex],
        max_length=20,
        verbose_name="Téléphone"
    )
    email = models.EmailField(verbose_name="Email", blank=True, null=True)
    
    # Pièce d'identité
    id_number = models.CharField(
        max_length=50,
        verbose_name="Numéro CNI/Passeport",
        blank=True
    )
    
    # Localisation
    location = models.CharField(
        max_length=200,
        verbose_name="Localisation",
        blank=True,
        help_text="Ex: Cocody, Abidjan"
    )
    
    # Propriété liée
    linked_property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name='tenants',
        verbose_name="Propriété liée"
    )
    
    # Informations du bail
    lease_start_date = models.DateField(verbose_name="Date début du bail")
    lease_end_date = models.DateField(
        verbose_name="Date fin du bail",
        null=True,
        blank=True,
        help_text="Laisser vide si durée indéterminée"
    )
    
    # Statut du contrat
    CONTRACT_STATUS_CHOICES = [
        ('actif', 'Actif'),
        ('en_attente', 'En attente'),
        ('expire', 'Expiré'),
        ('resilie', 'Résilié'),
    ]
    contract_status = models.CharField(
        max_length=20,
        choices=CONTRACT_STATUS_CHOICES,
        default='en_attente',
        verbose_name="Statut du contrat"
    )
    
    # Informations financières
    monthly_rent = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        verbose_name="Loyer mensuel (FCFA)"
    )
    
    security_deposit = models.CharField(
        max_length=100,
        verbose_name="Dépôt de garantie",
        blank=True,
        help_text="Ex: 1 mois de loyer, 2 mois de loyer"
    )
    
    PAYMENT_METHOD_CHOICES = [
        ('mobile_money', 'Mobile Money'),
        ('virement', 'Virement bancaire'),
        ('especes', 'Espèces'),
        ('cheque', 'Chèque'),
        ('orange_money', 'Orange Money'),
        ('mtn_money', 'MTN Money'),
    ]
    payment_method = models.CharField(
        max_length=30,
        choices=PAYMENT_METHOD_CHOICES,
        blank=True,
        verbose_name="Mode de paiement"
    )
    
    # Statut de paiement
    PAYMENT_STATUS_CHOICES = [
        ('a_jour', 'À jour'),
        ('impaye', 'Impayé'),
        ('retard', 'En retard'),
        ('en_attente', 'En attente'),
    ]
    payment_status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default='en_attente',
        verbose_name="Statut de paiement"
    )
    
    # Dates de paiement
    next_payment = models.DateField(
        verbose_name="Prochain paiement",
        null=True,
        blank=True
    )
    last_payment = models.DateField(
        verbose_name="Dernier paiement",
        null=True,
        blank=True
    )
    
    # Statistiques
    payments_count = models.IntegerField(
        default=0,
        verbose_name="Nombre de paiements effectués"
    )
    total_paid = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)],
        verbose_name="Total payé (FCFA)"
    )
    reliability = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        verbose_name="Fiabilité (%)",
        help_text="Pourcentage de fiabilité du locataire"
    )
    
    # Documents
    signed_contract = models.FileField(
        upload_to='contracts/',
        verbose_name="Contrat signé",
        blank=True,
        null=True,
        help_text="PDF, JPG ou PNG"
    )
    id_document = models.FileField(
        upload_to='identity_documents/',
        verbose_name="Justificatif d'identité",
        blank=True,
        null=True,
        help_text="CNI, Passeport"
    )
    
    # Notes
    additional_notes = models.TextField(
        verbose_name="Notes complémentaires",
        blank=True,
        help_text="Préférences, conditions spéciales, etc."
    )
    
    # Avatar (initiales générées automatiquement)
    avatar = models.CharField(max_length=10, blank=True, editable=False)
    
    # Métadonnées
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Dernière mise à jour")
    
    class Meta:
        verbose_name = "Locataire"
        verbose_name_plural = "Locataires"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['payment_status']),
            models.Index(fields=['contract_status']),
        ]
    
    # def save(self, *args, **kwargs):
    #     # Générer le nom complet automatiquement
    #     if not self.full_name:
    #         self.full_name = f"{self.first_name} {self.last_name}".strip()
        
    #     # Générer les initiales pour l'avatar
    #     if not self.avatar and self.first_name and self.last_name:
    #         self.avatar = f"{self.first_name[0]}{self.last_name[0]}".upper()
        
    #     # Définir le prochain paiement si pas défini
    #     if not self.next_payment and self.lease_start_date:
    #         self.next_payment = self.lease_start_date
        
    #     super().save(*args, **kwargs)
    
    def save(self, *args, **kwargs):
    # Générer les initiales pour l'avatar à partir du full_name
        if not self.avatar and self.full_name:
            # Extraire les initiales du nom complet
            name_parts = self.full_name.strip().split()
            if len(name_parts) >= 2:
                # Prendre la première lettre du prénom et du nom
                self.avatar = f"{name_parts[0][0]}{name_parts[-1][0]}".upper()
            elif len(name_parts) == 1:
                # Si un seul mot, prendre les 2 premières lettres
                self.avatar = name_parts[0][:2].upper()

        # Définir le prochain paiement si pas défini
        if not self.next_payment and self.lease_start_date:
            self.next_payment = self.lease_start_date
    
        super().save(*args, **kwargs)

    def __str__(self):
        return self.full_name or "Locataire sans nom"
    
    @property
    def is_overdue(self):
        """Vérifie si le paiement est en retard"""
        if self.next_payment and self.payment_status != 'a_jour':
            return self.next_payment < timezone.now().date()
        return False
>>>>>>> da64587f (Initial commit - version locale du projet FRONT-END-REAT)
