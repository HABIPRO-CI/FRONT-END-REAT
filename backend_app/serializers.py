from rest_framework import serializers
<<<<<<< HEAD
from .models import Document
from PyPDF2 import PdfReader
import io
=======
from .models import Document, Tenant, Property
from django.utils import timezone
from PyPDF2 import PdfReader
import io
import re
>>>>>>> da64587f (Initial commit - version locale du projet FRONT-END-REAT)

class DocumentSerializer(serializers.ModelSerializer):
    """Serializer pour le modèle Document"""
    
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Document
        fields = [
            'id',
            'title',
            'category',
            'type',
            'description',
            'content',
            'file',
            'file_url',
            'size',
            'pages',
            'tenant',
            'property',
            'status',
            'date',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'size', 'pages']
    
    def get_file_url(self, obj):
        """Retourne l'URL complète du fichier"""
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None
    
    def create(self, validated_data):
        """Override create pour extraire les métadonnées du PDF"""
        file = validated_data.get('file')
        
        if file:
            # Calculer la taille du fichier
            validated_data['size'] = self._format_file_size(file.size)
            
            # Extraire le nombre de pages du PDF
            try:
                pdf_file = io.BytesIO(file.read())
                pdf_reader = PdfReader(pdf_file)
                validated_data['pages'] = len(pdf_reader.pages)
                
                # Remettre le curseur au début pour la sauvegarde
                file.seek(0)
            except Exception as e:
                # En cas d'erreur, on garde la valeur par défaut
                validated_data['pages'] = 1
        
        return super().create(validated_data)
    
    def _format_file_size(self, size_bytes):
        """Formate la taille du fichier"""
        if size_bytes < 1024:
            return f"{size_bytes} B"
        elif size_bytes < 1024 * 1024:
            return f"{size_bytes / 1024:.1f} KB"
        else:
            return f"{size_bytes / (1024 * 1024):.1f} MB"


class DocumentListSerializer(serializers.ModelSerializer):
    """Serializer simplifié pour la liste des documents"""
    
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Document
        fields = [
            'id',
            'title',
            'category',
            'type',
            'date',
            'size',
            'pages',
            'tenant',
            'property',
            'status',
            'description',
            'file_url'
        ]
    
    def get_file_url(self, obj):
        """Retourne l'URL complète du fichier"""
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None


class DocumentUploadSerializer(serializers.Serializer):
    """Serializer pour l'upload multiple de documents"""
    
    files = serializers.ListField(
        child=serializers.FileField(
            max_length=100000,
            allow_empty_file=False,
            use_url=False
        ),
        write_only=True
    )
    category = serializers.ChoiceField(
        choices=Document.CATEGORY_CHOICES,
        required=True
    )
    tenant = serializers.CharField(max_length=255, required=False)
    property = serializers.CharField(max_length=255, required=False)
    status = serializers.ChoiceField(
        choices=Document.STATUS_CHOICES,
        default='active'
    )
    
    def validate_files(self, files):
        """Valide que tous les fichiers sont des PDF"""
        for file in files:
            if not file.name.lower().endswith('.pdf'):
                raise serializers.ValidationError(
                    f"Le fichier {file.name} n'est pas un PDF. Seuls les fichiers PDF sont acceptés."
                )
<<<<<<< HEAD
        return files
=======
        return files
    


class PropertySerializer(serializers.ModelSerializer):
    """Serializer pour les propriétés"""
    tenant_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Property
        fields = ['id', 'name', 'address', 'tenant_count', 'created_at']
        read_only_fields = ['created_at']
    
    def get_tenant_count(self, obj):
        """Retourne le nombre de locataires pour cette propriété"""
        return obj.tenants.count()


# class TenantListSerializer(serializers.ModelSerializer):
#     """Serializer simplifié pour la liste des locataires"""
#     property_name = serializers.CharField(source='property.name', read_only=True)
#     property_id = serializers.IntegerField(source='property.id', read_only=True)
    
#     class Meta:
#         model = Tenant
#         fields = [
#             'id',
#             'full_name',
#             'title',
#             'location',
#             'phone',
#             'email',
#             'property_name',
#             'property_id',
#             'rent',
#             'contract_status',
#             'payment_status',
#             'next_payment',
#             'contract_start',
#             'contract_end',
#             'last_payment',
#             'avatar',
#             'payments_count',
#             'total_paid',
#             'reliability',
#             'created_at'
#         ]
#         read_only_fields = ['avatar', 'full_name', 'created_at']

class TenantListSerializer(serializers.ModelSerializer):
    """Serializer simplifié pour la liste des locataires"""
    property_name = serializers.CharField(source='linked_property.name', read_only=True)
    property_id = serializers.IntegerField(source='linked_property.id', read_only=True)
    
    class Meta:
        model = Tenant
        fields = [
            'id',
            'full_name',
            'title',
            'location',
            'phone',
            'email',
            'property_name',
            'property_id',
            'monthly_rent',  # ✅ Corrigé : 'rent' → 'monthly_rent'
            'contract_status',
            'payment_status',
            'next_payment',
            'lease_start_date',  # ✅ Corrigé : 'contract_start' → 'lease_start_date'
            'lease_end_date',    # ✅ Corrigé : 'contract_end' → 'lease_end_date'
            'last_payment',
            'avatar',
            'payments_count',
            'total_paid',
            'reliability',
            'created_at'
        ]
        read_only_fields = ['avatar', 'full_name', 'created_at']

class TenantSerializer(serializers.ModelSerializer):
    """Serializer complet pour les locataires - Création et Modification"""
    
    # Champs personnalisés pour correspondre au frontend React
    fullName = serializers.CharField(
        source='full_name',
        required=True,
        max_length=200,
        error_messages={
            'required': 'Le nom complet est obligatoire',
            'blank': 'Le nom complet ne peut pas être vide'
        }
    )
    
    idNumber = serializers.CharField(
        source='id_number',
        required=False,
        allow_blank=True,
        max_length=50
    )
    
    linkedProperty = serializers.PrimaryKeyRelatedField(
        source='linked_property',
        queryset=Property.objects.all(),
        required=True,
        error_messages={
            'required': 'La propriété liée est obligatoire',
            'does_not_exist': 'Cette propriété n\'existe pas'
        }
    )
    
    leaseStartDate = serializers.DateField(
        source='lease_start_date',
        required=True,
        error_messages={
            'required': 'La date de début de bail est obligatoire',
            'invalid': 'Format de date invalide'
        }
    )
    
    leaseEndDate = serializers.DateField(
        source='lease_end_date',
        required=False,
        allow_null=True
    )
    
    monthlyRent = serializers.DecimalField(
        source='monthly_rent',
        max_digits=12,
        decimal_places=2,
        required=True,
        error_messages={
            'required': 'Le montant du loyer est obligatoire',
            'invalid': 'Montant invalide'
        }
    )
    
    securityDeposit = serializers.CharField(
        source='security_deposit',
        required=False,
        allow_blank=True,
        max_length=100
    )
    
    paymentMethod = serializers.ChoiceField(
        source='payment_method',
        choices=Tenant.PAYMENT_METHOD_CHOICES,
        required=False,
        allow_blank=True
    )
    
    signedContract = serializers.FileField(
        source='signed_contract',
        required=False,
        allow_null=True
    )
    
    idDocument = serializers.FileField(
        source='id_document',
        required=False,
        allow_null=True
    )
    
    additionalNotes = serializers.CharField(
        source='additional_notes',
        required=False,
        allow_blank=True,
        style={'base_template': 'textarea.html'}
    )
    
    # Champs en lecture seule
    property_name = serializers.CharField(source='property.name', read_only=True)
    is_overdue = serializers.BooleanField(read_only=True)
    avatar = serializers.CharField(read_only=True)
    
    class Meta:
        model = Tenant
        fields = [
            # Champs du formulaire React
            'id',
            'fullName',
            'phone',
            'email',
            'idNumber',
            'linkedProperty',
            'leaseStartDate',
            'leaseEndDate',
            'monthlyRent',
            'securityDeposit',
            'paymentMethod',
            'signedContract',
            'idDocument',
            'additionalNotes',
            
            # Champs additionnels
            'full_name',
            'title',
            'location',
            'linked_property',
            'property_name',
            'contract_status',
            'payment_status',
            'next_payment',
            'last_payment',
            'payments_count',
            'total_paid',
            'reliability',
            'avatar',
            'is_overdue',
            'created_at',
            'updated_at'
        ]
        read_only_fields = [
            'id',
            'avatar',
            'full_name',
            'is_overdue',
            'created_at',
            'updated_at',
            'property_name'
        ]
        extra_kwargs = {
            'phone': {
                'required': True,
                'error_messages': {
                    'required': 'Le téléphone est obligatoire',
                    'invalid': 'Format de téléphone invalide'
                }
            },
            'email': {
                'required': False,
                'allow_blank': True,
                'error_messages': {
                    'invalid': 'Format d\'email invalide'
                }
            }
        }
    
    def validate_phone(self, value):
        """Validation personnalisée du numéro de téléphone"""
        # Regex pour valider le format
        phone_pattern = r'^[\d\s\-\+\(\)]+$'
        if not re.match(phone_pattern, value):
            raise serializers.ValidationError('Format de téléphone invalide')
        
        # Vérifier que le numéro n'est pas vide après nettoyage
        cleaned_phone = re.sub(r'[\s\-\(\)]', '', value)
        if len(cleaned_phone) < 8:
            raise serializers.ValidationError('Le numéro de téléphone est trop court')
        
        return value
    
    def validate_email(self, value):
        """Validation de l'email"""
        if value and value.strip():
            # Vérifier le format email
            email_pattern = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
            if not re.match(email_pattern, value):
                raise serializers.ValidationError('Format d\'email invalide')
        return value
    
    def validate_monthlyRent(self, value):
        """Validation du montant du loyer"""
        if value <= 0:
            raise serializers.ValidationError('Le montant du loyer doit être supérieur à 0')
        return value
    
    def validate_leaseEndDate(self, value):
        """Validation de la date de fin de bail"""
        if value:
            lease_start = self.initial_data.get('leaseStartDate')
            if lease_start and value <= lease_start:
                raise serializers.ValidationError(
                    'La date de fin doit être après la date de début'
                )
        return value
    
    def validate_signedContract(self, value):
        """Validation du fichier de contrat"""
        if value:
            # Vérifier la taille du fichier (max 10MB)
            if value.size > 10 * 1024 * 1024:
                raise serializers.ValidationError(
                    'La taille du fichier ne doit pas dépasser 10MB'
                )
            
            # Vérifier le type de fichier
            allowed_types = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
            if value.content_type not in allowed_types:
                raise serializers.ValidationError(
                    'Format non supporté. Utilisez PDF, JPG ou PNG'
                )
        return value
    
    def validate_idDocument(self, value):
        """Validation du document d'identité"""
        if value:
            # Vérifier la taille du fichier (max 10MB)
            if value.size > 10 * 1024 * 1024:
                raise serializers.ValidationError(
                    'La taille du fichier ne doit pas dépasser 10MB'
                )
            
            # Vérifier le type de fichier
            allowed_types = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
            if value.content_type not in allowed_types:
                raise serializers.ValidationError(
                    'Format non supporté. Utilisez PDF, JPG ou PNG'
                )
        return value
    
    def create(self, validated_data):
        """Création d'un nouveau locataire"""
        # Définir le statut de paiement initial
        if 'payment_status' not in validated_data:
            validated_data['payment_status'] = 'en_attente'
        
        # Définir le statut du contrat initial
        if 'contract_status' not in validated_data:
            validated_data['contract_status'] = 'en_attente'
        
        # Définir la date du prochain paiement
        if 'next_payment' not in validated_data:
            validated_data['next_payment'] = validated_data.get('lease_start_date')
        
        # Créer le locataire
        tenant = Tenant.objects.create(**validated_data)
        return tenant
    
    def update(self, instance, validated_data):
        """Mise à jour d'un locataire existant"""
        # Mettre à jour les champs
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance
    
    def to_representation(self, instance):
        """Personnaliser la réponse JSON"""
        representation = super().to_representation(instance)
        
        # Formater les montants
        if representation.get('monthlyRent'):
            representation['monthly_rent_formatted'] = f"{float(representation['monthlyRent']):,.0f} FCFA"
        
        if representation.get('total_paid'):
            representation['total_paid_formatted'] = f"{float(representation['total_paid']):,.0f} FCFA"
        
        # Ajouter des URLs pour les documents
        if instance.signed_contract:
            representation['signed_contract_url'] = instance.signed_contract.url
        else:
            representation['signed_contract_url'] = None
        
        if instance.id_document:
            representation['id_document_url'] = instance.id_document.url
        else:
            representation['id_document_url'] = None
        
        return representation
    
    linked_property = serializers.SerializerMethodField()
    
    def get_linked_property(self, obj):
        """Retourne les détails complets de la propriété liée"""
        if obj.linked_property:
            return {
                'id': obj.linked_property.id,
                'name': obj.linked_property.name,
                'address': obj.linked_property.address or 'Non spécifiée'
            }
        return None
    



class TenantStatsSerializer(serializers.Serializer):
    """Serializer pour les statistiques des locataires"""
    total = serializers.IntegerField()
    active = serializers.IntegerField()
    overdue = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_revenue_formatted = serializers.CharField()
>>>>>>> da64587f (Initial commit - version locale du projet FRONT-END-REAT)
