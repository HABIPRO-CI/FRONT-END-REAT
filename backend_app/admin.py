from django.contrib import admin
<<<<<<< HEAD
from .models import Document
=======
from .models import Document,  Tenant, Property
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import Tenant, Property


>>>>>>> da64587f (Initial commit - version locale du projet FRONT-END-REAT)

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    """
    Configuration de l'interface admin pour les documents
    """
    list_display = [
        'title',
        'category',
        'type',
        'tenant',
        'property',
        'status',
        'date',
        'size',
        'pages',
        'created_at'
    ]
    
    list_filter = [
        'category',
        'status',
        'date',
        'created_at'
    ]
    
    search_fields = [
        'title',
        'description',
        'tenant',
        'property',
        'content'
    ]
    
    readonly_fields = [
        'created_at',
        'updated_at',
        'size',
        'pages'
    ]
    
    fieldsets = (
        ('Informations principales', {
            'fields': (
                'title',
                'category',
                'type',
                'description',
                'status'
            )
        }),
        ('Fichier', {
            'fields': (
                'file',
                'size',
                'pages'
            )
        }),
        ('Informations liées', {
            'fields': (
                'tenant',
                'property',
                'date'
            )
        }),
        ('Contenu', {
            'fields': ('content',),
            'classes': ('collapse',)
        }),
        ('Métadonnées', {
            'fields': (
                'created_at',
                'updated_at'
            ),
            'classes': ('collapse',)
        }),
    )
    
    date_hierarchy = 'date'
    
    ordering = ['-date', '-created_at']
    
    list_per_page = 25
    
    def get_queryset(self, request):
        """Optimise les requêtes"""
        qs = super().get_queryset(request)
        return qs.select_related()
    
    actions = ['mark_as_active', 'mark_as_completed']
    
    def mark_as_active(self, request, queryset):
        """Marque les documents sélectionnés comme actifs"""
        updated = queryset.update(status='active')
        self.message_user(
            request,
            f'{updated} document(s) marqué(s) comme actif(s).'
        )
    mark_as_active.short_description = "Marquer comme actif"
    
    def mark_as_completed(self, request, queryset):
        """Marque les documents sélectionnés comme terminés"""
        updated = queryset.update(status='completed')
        self.message_user(
            request,
            f'{updated} document(s) marqué(s) comme terminé(s).'
        )
<<<<<<< HEAD
    mark_as_completed.short_description = "Marquer comme terminé"
=======
    mark_as_completed.short_description = "Marquer comme terminé"







@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    """Administration des propriétés"""
    list_display = ['name', 'address', 'tenant_count', 'created_at']
    search_fields = ['name', 'address']
    list_filter = ['created_at']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Informations de la propriété', {
            'fields': ('name', 'address')
        }),
        ('Métadonnées', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']
    
    def tenant_count(self, obj):
        """Affiche le nombre de locataires"""
        count = obj.tenants.count()
        return format_html(
            '<span style="background-color: #4CAF50; color: white; padding: 3px 8px; border-radius: 10px;">{}</span>',
            count
        )
    tenant_count.short_description = 'Nombre de locataires'


@admin.register(Tenant)
class TenantAdmin(admin.ModelAdmin):
    """Administration des locataires"""
    
    # Affichage de la liste
    list_display = [
        'avatar_display',
        'full_name',
        'phone',
        'linked_property',
        'monthly_rent_display',
        'payment_status_badge',
        'contract_status_badge',
        'next_payment',
        'created_at'
    ]
    
    # Filtres latéraux
    list_filter = [
        'payment_status',
        'contract_status',
        'payment_method',
        'linked_property',
        'created_at',
        'lease_start_date'
    ]
    
    # Champs de recherche
    search_fields = [
        'full_name',
        'phone',
        'email',
        'id_number',
        'linked_property__name'
    ]
    
    # Champs en lecture seule
    readonly_fields = [
        'avatar',
        'full_name',
        'created_at',
        'updated_at',
        'is_overdue',
        'contract_document_preview',
        'id_document_preview'
    ]
    
    # Organisation en onglets/sections
    fieldsets = (
        ('👤 Informations personnelles', {
            'fields': (
                'full_name',
                'avatar',
                'title',
                'location'
            )
        }),
        ('📞 Contact', {
            'fields': (
                'phone',
                'email'
            )
        }),
        ('🪪 Identification', {
            'fields': ('id_number',),
            'classes': ('collapse',)
        }),
        ('🏠 Propriété et Bail', {
            'fields': (
                'linked_property',
                ('lease_start_date', 'lease_end_date'),
                'contract_status'
            )
        }),
        ('💰 Informations financières', {
            'fields': (
                'monthly_rent',
                'security_deposit',
                'payment_method',
                'payment_status',
                ('next_payment', 'last_payment')
            )
        }),
        ('📊 Statistiques', {
            'fields': (
                ('payments_count', 'total_paid'),
                'reliability',
                'is_overdue'
            ),
            'classes': ('collapse',)
        }),
        ('📂 Documents', {
            'fields': (
                'signed_contract',
                'contract_document_preview',
                'id_document',
                'id_document_preview'
            ),
            'classes': ('collapse',)
        }),
        ('📝 Notes', {
            'fields': ('additional_notes',),
            'classes': ('collapse',)
        }),
        ('🕒 Métadonnées', {
            'fields': (
                'created_at',
                'updated_at'
            ),
            'classes': ('collapse',)
        }),
    )
    
    # Ordre par défaut
    ordering = ['-created_at']
    
    # Nombre d'éléments par page
    list_per_page = 20
    
    # Actions personnalisées
    actions = [
        'mark_as_paid',
        'mark_as_overdue',
        'activate_contract',
        'send_payment_reminder'
    ]
    
    # Méthodes d'affichage personnalisées
    
    def avatar_display(self, obj):
        """Affiche l'avatar avec les initiales"""
        colors = {
            'a_jour': '#10B981',
            'impaye': '#EF4444',
            'retard': '#F59E0B',
            'en_attente': '#3B82F6'
        }
        color = colors.get(obj.payment_status, '#6B7280')
        
        return format_html(
            '<div style="width: 40px; height: 40px; border-radius: 8px; '
            'background: linear-gradient(135deg, {} 0%, {} 100%); '
            'display: flex; align-items: center; justify-content: center; '
            'color: white; font-weight: bold; font-size: 14px;">{}</div>',
            color,
            color,
            obj.avatar
        )
    avatar_display.short_description = ''
    
    # def monthly_rent_display(self, obj):
    #     """Affiche le loyer mensuel formaté"""
    #     return format_html(
    #         '<span style="font-weight: bold; color: #1F2937;">{:,.0f} FCFA</span>',
    #         obj.monthly_rent
    #     )

    def monthly_rent_display(self, obj):
        """Affiche le loyer mensuel formaté"""
        return format_html(
            '<span style="font-weight: bold; color: #1F2937;">{} FCFA</span>',
            f"{obj.monthly_rent:,.0f}"
        )

    monthly_rent_display.short_description = 'Loyer mensuel'
    monthly_rent_display.admin_order_field = 'monthly_rent'
    
    def payment_status_badge(self, obj):
        """Badge coloré pour le statut de paiement"""
        status_config = {
            'a_jour': {'label': 'À jour', 'color': '#10B981', 'bg': '#D1FAE5'},
            'impaye': {'label': 'Impayé', 'color': '#EF4444', 'bg': '#FEE2E2'},
            'retard': {'label': 'En retard', 'color': '#F59E0B', 'bg': '#FEF3C7'},
            'en_attente': {'label': 'En attente', 'color': '#3B82F6', 'bg': '#DBEAFE'}
        }
        config = status_config.get(obj.payment_status, status_config['en_attente'])
        
        return format_html(
            '<span style="background-color: {}; color: {}; padding: 4px 10px; '
            'border-radius: 12px; font-size: 11px; font-weight: 600; '
            'text-transform: uppercase; letter-spacing: 0.5px;">{}</span>',
            config['bg'],
            config['color'],
            config['label']
        )
    payment_status_badge.short_description = 'Statut paiement'
    payment_status_badge.admin_order_field = 'payment_status'
    
    def contract_status_badge(self, obj):
        """Badge coloré pour le statut du contrat"""
        status_config = {
            'actif': {'label': 'Actif', 'color': '#10B981', 'bg': '#D1FAE5'},
            'en_attente': {'label': 'En attente', 'color': '#F59E0B', 'bg': '#FEF3C7'},
            'expire': {'label': 'Expiré', 'color': '#EF4444', 'bg': '#FEE2E2'},
            'resilie': {'label': 'Résilié', 'color': '#6B7280', 'bg': '#F3F4F6'}
        }
        config = status_config.get(obj.contract_status, status_config['en_attente'])
        
        return format_html(
            '<span style="background-color: {}; color: {}; padding: 4px 10px; '
            'border-radius: 12px; font-size: 11px; font-weight: 600; '
            'text-transform: uppercase; letter-spacing: 0.5px;">{}</span>',
            config['bg'],
            config['color'],
            config['label']
        )
    contract_status_badge.short_description = 'Statut contrat'
    contract_status_badge.admin_order_field = 'contract_status'
    
    def contract_document_preview(self, obj):
        """Affiche un aperçu du contrat signé"""
        if obj.signed_contract:
            return format_html(
                '<a href="{}" target="_blank" style="color: #3B82F6; text-decoration: none; '
                'font-weight: 500;">📄 Voir le contrat</a>',
                obj.signed_contract.url
            )
        return format_html('<span style="color: #9CA3AF;">Aucun contrat</span>')
    contract_document_preview.short_description = 'Aperçu du contrat'
    
    def id_document_preview(self, obj):
        """Affiche un aperçu du document d'identité"""
        if obj.id_document:
            return format_html(
                '<a href="{}" target="_blank" style="color: #3B82F6; text-decoration: none; '
                'font-weight: 500;">🪪 Voir la pièce d\'identité</a>',
                obj.id_document.url
            )
        return format_html('<span style="color: #9CA3AF;">Aucun document</span>')
    id_document_preview.short_description = 'Aperçu du document'
    
    # Actions groupées
    
    @admin.action(description='✅ Marquer comme payé')
    def mark_as_paid(self, request, queryset):
        """Marque les locataires sélectionnés comme ayant payé"""
        updated = queryset.update(payment_status='a_jour')
        self.message_user(
            request,
            f'{updated} locataire(s) marqué(s) comme payé(s).',
            level='success'
        )
    
    @admin.action(description='⚠️ Marquer comme impayé')
    def mark_as_overdue(self, request, queryset):
        """Marque les locataires sélectionnés comme impayés"""
        updated = queryset.update(payment_status='impaye')
        self.message_user(
            request,
            f'{updated} locataire(s) marqué(s) comme impayé(s).',
            level='warning'
        )
    
    @admin.action(description='🔄 Activer le contrat')
    def activate_contract(self, request, queryset):
        """Active les contrats sélectionnés"""
        updated = queryset.update(contract_status='actif')
        self.message_user(
            request,
            f'{updated} contrat(s) activé(s).',
            level='success'
        )
    
    @admin.action(description='📧 Envoyer rappel de paiement')
    def send_payment_reminder(self, request, queryset):
        """Envoie un rappel de paiement (simulation)"""
        count = queryset.count()
        # Ici vous pouvez implémenter l'envoi réel de notifications
        self.message_user(
            request,
            f'Rappel de paiement envoyé à {count} locataire(s).',
            level='info'
        )
    
    # Personnalisation du formulaire
    
    def get_form(self, request, obj=None, **kwargs):
        """Personnalise le formulaire d'administration"""
        form = super().get_form(request, obj, **kwargs)
        
        # Ajouter des classes CSS personnalisées
        if 'monthly_rent' in form.base_fields:
            form.base_fields['monthly_rent'].widget.attrs.update({
                'style': 'width: 200px;'
            })
        
        return form
    
    # Informations supplémentaires
    
    def get_queryset(self, request):
        """Optimise les requêtes pour éviter le N+1"""
        qs = super().get_queryset(request)
        return qs.select_related('linked_property')
    
    class Media:
        css = {
            'all': ('admin/css/tenant_admin.css',)  # Si vous avez du CSS personnalisé
        }
>>>>>>> da64587f (Initial commit - version locale du projet FRONT-END-REAT)
