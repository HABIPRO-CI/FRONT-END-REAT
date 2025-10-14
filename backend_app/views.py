<<<<<<< HEAD
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.db.models import Q, Count
from django.http import FileResponse, HttpResponse
from .models import Document
from .serializers import (
    DocumentSerializer, 
    DocumentListSerializer,
    DocumentUploadSerializer
=======
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.db.models import Q, Count, Sum
from django.http import FileResponse, HttpResponse
from django.utils import timezone
from .models import Document,Tenant, Property

from .serializers import (
    DocumentSerializer, 
    DocumentListSerializer,
    DocumentUploadSerializer,
    TenantSerializer,
    TenantListSerializer,
    PropertySerializer,
    TenantStatsSerializer
>>>>>>> da64587f (Initial commit - version locale du projet FRONT-END-REAT)
)
import io
from datetime import datetime

<<<<<<< HEAD
=======


>>>>>>> da64587f (Initial commit - version locale du projet FRONT-END-REAT)
class DocumentViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour gérer les documents
    """
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    
    def get_serializer_class(self):
        """Retourne le serializer approprié selon l'action"""
        if self.action == 'list':
            return DocumentListSerializer
        elif self.action == 'upload_multiple':
            return DocumentUploadSerializer
        return DocumentSerializer
    
    def get_queryset(self):
        """
        Filtre les documents selon les paramètres de requête
        """
        queryset = Document.objects.all()
        
        # Filtre par catégorie
        category = self.request.query_params.get('category', None)
        if category and category != 'all':
            queryset = queryset.filter(category=category)
        
        # Filtre par statut
        status_param = self.request.query_params.get('status', None)
        if status_param:
            queryset = queryset.filter(status=status_param)
        
        # Filtre par locataire
        tenant = self.request.query_params.get('tenant', None)
        if tenant:
            queryset = queryset.filter(tenant__icontains=tenant)
        
        # Filtre par propriété
        property_param = self.request.query_params.get('property', None)
        if property_param:
            queryset = queryset.filter(property__icontains=property_param)
        
        # Recherche globale
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(tenant__icontains=search) |
                Q(property__icontains=search)
            )
        
        return queryset.order_by('-date', '-created_at')
    
    def create(self, request, *args, **kwargs):
        """
        Crée un nouveau document
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        headers = self.get_success_headers(serializer.data)
        return Response(
            {
                'message': 'Document créé avec succès',
                'data': serializer.data
            },
            status=status.HTTP_201_CREATED,
            headers=headers
        )
    
    def update(self, request, *args, **kwargs):
        """
        Met à jour un document
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response({
            'message': 'Document mis à jour avec succès',
            'data': serializer.data
        })
    
    def destroy(self, request, *args, **kwargs):
        """
        Supprime un document
        """
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {'message': 'Document supprimé avec succès'},
            status=status.HTTP_200_OK
        )
    
    @action(detail=False, methods=['post'], url_path='upload-multiple')
    def upload_multiple(self, request):
        """
        Upload multiple de documents PDF
        """
        serializer = DocumentUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        files = serializer.validated_data.get('files', [])
        category = serializer.validated_data.get('category')
        tenant = serializer.validated_data.get('tenant', 'Non spécifié')
        property_name = serializer.validated_data.get('property', 'Non spécifiée')
        status_val = serializer.validated_data.get('status', 'active')
        
        created_documents = []
        errors = []
        
        for file in files:
            try:
                # Créer le document
                document_data = {
                    'title': file.name.replace('.pdf', ''),
                    'category': category,
                    'type': self._get_type_from_category(category),
                    'tenant': tenant,
                    'property': property_name,
                    'status': status_val,
                    'date': datetime.now().date(),
                    'file': file
                }
                
                doc_serializer = DocumentSerializer(
                    data=document_data,
                    context={'request': request}
                )
                
                if doc_serializer.is_valid():
                    doc_serializer.save()
                    created_documents.append(doc_serializer.data)
                else:
                    errors.append({
                        'file': file.name,
                        'errors': doc_serializer.errors
                    })
                    
            except Exception as e:
                errors.append({
                    'file': file.name,
                    'error': str(e)
                })
        
        return Response({
            'message': f'{len(created_documents)} document(s) créé(s) avec succès',
            'created': created_documents,
            'errors': errors,
            'total_uploaded': len(created_documents),
            'total_errors': len(errors)
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['get'], url_path='download')
    def download(self, request, pk=None):
        """
        Télécharge un document
        """
        document = self.get_object()
        
        if not document.file:
            return Response(
                {'error': 'Aucun fichier associé à ce document'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        try:
            response = FileResponse(
                document.file.open('rb'),
                content_type='application/pdf'
            )
            response['Content-Disposition'] = f'attachment; filename="{document.title}.pdf"'
            return response
        except Exception as e:
            return Response(
                {'error': f'Erreur lors du téléchargement: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['get'], url_path='preview')
    def preview(self, request, pk=None):
        """
        Prévisualise un document (inline)
        """
        document = self.get_object()
        
        if not document.file:
            return Response(
                {'error': 'Aucun fichier associé à ce document'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        try:
            response = FileResponse(
                document.file.open('rb'),
                content_type='application/pdf'
            )
            response['Content-Disposition'] = f'inline; filename="{document.title}.pdf"'
            return response
        except Exception as e:
            return Response(
                {'error': f'Erreur lors de la prévisualisation: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'], url_path='statistics')
    def statistics(self, request):
        """
        Retourne les statistiques sur les documents
        """
        stats = {
            'total': Document.objects.count(),
            'by_category': {},
            'by_status': {},
            'recent': Document.objects.order_by('-created_at')[:5].values(
                'id', 'title', 'category', 'created_at'
            )
        }
        
        # Statistiques par catégorie
        categories = Document.objects.values('category').annotate(
            count=Count('id')
        )
        for cat in categories:
            stats['by_category'][cat['category']] = cat['count']
        
        # Statistiques par statut
        statuses = Document.objects.values('status').annotate(
            count=Count('id')
        )
        for stat in statuses:
            stats['by_status'][stat['status']] = stat['count']
        
        return Response(stats)
    
    def _get_type_from_category(self, category):
        """Retourne le type par défaut selon la catégorie"""
        types_map = {
            'contracts': 'Contrat de bail',
            'inventory': 'État des lieux',
            'receipts': 'Quittance de loyer',
            'insurance': 'Police d\'assurance'
        }
<<<<<<< HEAD
        return types_map.get(category, 'Document')
=======
        return types_map.get(category, 'Document')




class PropertyViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour les propriétés
    GET /api/properties/ - Liste des propriétés pour le dropdown
    """
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    
    def get_queryset(self):
        """Retourne toutes les propriétés, triées par nom"""
        return Property.objects.all().order_by('name')
    
    def list(self, request, *args, **kwargs):
        """
        Liste des propriétés disponibles
        Format attendu par le frontend React
        """
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        # Formater pour le dropdown React
        properties = [
            {
                'id': prop['id'],
                'name': prop['name'],
                'label': prop['name'],  # Pour compatibilité select
                'value': prop['id']      # Pour compatibilité select
            }
            for prop in serializer.data
        ]
        
        return Response({
            'success': True,
            'count': len(properties),
            'data': properties
        })


class TenantViewSet(viewsets.ModelViewSet):
    """
    ViewSet principal pour les locataires
    
    Endpoints disponibles:
    - GET    /api/tenants/          Liste tous les locataires
    - POST   /api/tenants/          Créer un nouveau locataire
    - GET    /api/tenants/{id}/     Détails d'un locataire
    - PUT    /api/tenants/{id}/     Modifier un locataire (complet)
    - PATCH  /api/tenants/{id}/     Modifier un locataire (partiel)
    - DELETE /api/tenants/{id}/     Supprimer un locataire
    - GET    /api/tenants/stats/    Statistiques générales
    """
    queryset = Tenant.objects.all()
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['full_name', 'phone', 'email', 'linked_property__name']
    ordering_fields = ['created_at', 'monthly_rent', 'next_payment', 'payment_status']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        """
        Utilise un serializer différent selon l'action
        """
        if self.action == 'list':
            return TenantListSerializer
        return TenantSerializer
    
    def get_queryset(self):
        """
        Filtre les locataires selon les paramètres de recherche du frontend
        """
        queryset = Tenant.objects.select_related('linked_property').all()
        
        # Filtres du frontend React
        search_term = self.request.query_params.get('search', None)
        status_filter = self.request.query_params.get('paymentStatus', None)
        property_filter = self.request.query_params.get('propertyId', None)
        contract_status = self.request.query_params.get('contractStatus', None)
        
        # Filtre par terme de recherche
        if search_term:
            queryset = queryset.filter(
                Q(full_name__icontains=search_term) |
                Q(phone__icontains=search_term) |
                Q(email__icontains=search_term) |
                Q(linked_property__name__icontains=search_term)
            )
        
        # Filtre par statut de paiement
        if status_filter and status_filter != 'all':
            queryset = queryset.filter(payment_status=status_filter)
        
        # Filtre par propriété
        if property_filter and property_filter != 'all':
            queryset = queryset.filter(property_id=property_filter)
        
        # Filtre par statut de contrat
        if contract_status and contract_status != 'all':
            queryset = queryset.filter(contract_status=contract_status)
        
        return queryset
    
    def list(self, request, *args, **kwargs):
        """
        Liste tous les locataires avec format adapté au frontend React
        """
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        
        return Response({
            'success': True,
            'count': len(serializer.data),
            'data': serializer.data
        })
    
    def create(self, request, *args, **kwargs):
        """
        Crée un nouveau locataire depuis le formulaire React
        POST /api/tenants/
        """
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response({
                'success': True,
                'message': 'Locataire créé avec succès',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'message': 'Erreur lors de la création du locataire',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def retrieve(self, request, *args, **kwargs):
        """
        Récupère les détails d'un locataire
        GET /api/tenants/{id}/
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        
        return Response({
            'success': True,
            'data': serializer.data
        })
    
    def update(self, request, *args, **kwargs):
        """
        Met à jour un locataire (complet)
        PUT /api/tenants/{id}/
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        
        if serializer.is_valid():
            self.perform_update(serializer)
            return Response({
                'success': True,
                'message': 'Locataire modifié avec succès',
                'data': serializer.data
            })
        
        return Response({
            'success': False,
            'message': 'Erreur lors de la modification',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def partial_update(self, request, *args, **kwargs):
        """
        Met à jour partiellement un locataire
        PATCH /api/tenants/{id}/
        """
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        """
        Supprime un locataire
        DELETE /api/tenants/{id}/
        """
        instance = self.get_object()
        tenant_name = instance.full_name
        self.perform_destroy(instance)
        
        return Response({
            'success': True,
            'message': f'Locataire "{tenant_name}" supprimé avec succès'
        }, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """
        Retourne les statistiques générales
        GET /api/tenants/stats/
        
        Utilisé pour afficher les cards de statistiques en haut de la page
        """
        tenants = Tenant.objects.all()
        
        # Calcul des statistiques
        total = tenants.count()
        active = tenants.filter(contract_status='actif').count()
        overdue = tenants.filter(
            Q(payment_status='impaye') | Q(payment_status='retard')
        ).count()
        
        # Revenus mensuels totaux (uniquement contrats actifs)
        total_revenue = tenants.filter(
            contract_status='actif'
        ).aggregate(
            total=Sum('monthly_rent')
        )['total'] or 0
        
        stats_data = {
            'total': total,
            'active': active,
            'overdue': overdue,
            'total_revenue': float(total_revenue),
            'total_revenue_formatted': f"{float(total_revenue):,.0f} FCFA"
        }
        
        serializer = TenantStatsSerializer(stats_data)
        
        return Response({
            'success': True,
            'data': serializer.data
        })
    
    @action(detail=True, methods=['post'])
    def send_reminder(self, request, pk=None):
        """
        Envoie un rappel de paiement à un locataire
        POST /api/tenants/{id}/send_reminder/
        """
        tenant = self.get_object()
        
        # Ici tu peux implémenter l'envoi réel (SMS, Email, WhatsApp)
        # Pour le moment, c'est une simulation
        
        return Response({
            'success': True,
            'message': f'Rappel de paiement envoyé à {tenant.full_name}'
        })
    
    @action(detail=True, methods=['post'])
    def mark_as_paid(self, request, pk=None):
        """
        Marque un locataire comme ayant payé
        POST /api/tenants/{id}/mark_as_paid/
        """
        tenant = self.get_object()
        
        # Mettre à jour le statut
        tenant.payment_status = 'a_jour'
        tenant.last_payment = timezone.now().date()
        tenant.payments_count += 1
        tenant.total_paid += tenant.monthly_rent
        
        # Calculer le prochain paiement (1 mois après)
        from dateutil.relativedelta import relativedelta
        if tenant.next_payment:
            tenant.next_payment = tenant.next_payment + relativedelta(months=1)
        
        # Recalculer la fiabilité
        if tenant.payments_count > 0:
            # Logique simple : augmenter la fiabilité
            tenant.reliability = min(100, tenant.reliability + 5)
        
        tenant.save()
        
        serializer = self.get_serializer(tenant)
        
        return Response({
            'success': True,
            'message': f'{tenant.full_name} marqué comme ayant payé',
            'data': serializer.data
        })
    
    @action(detail=True, methods=['post'])
    def mark_as_overdue(self, request, pk=None):
        """
        Marque un locataire comme impayé
        POST /api/tenants/{id}/mark_as_overdue/
        """
        tenant = self.get_object()
        tenant.payment_status = 'impaye'
        
        # Réduire la fiabilité
        tenant.reliability = max(0, tenant.reliability - 10)
        tenant.save()
        
        serializer = self.get_serializer(tenant)
        
        return Response({
            'success': True,
            'message': f'{tenant.full_name} marqué comme impayé',
            'data': serializer.data
        })
    
    @action(detail=False, methods=['get'])
    def overdue_list(self, request):
        """
        Liste des locataires en impayé ou retard
        GET /api/tenants/overdue_list/
        """
        overdue_tenants = self.get_queryset().filter(
            Q(payment_status='impaye') | Q(payment_status='retard')
        )
        
        serializer = TenantListSerializer(overdue_tenants, many=True)
        
        return Response({
            'success': True,
            'count': len(serializer.data),
            'data': serializer.data
        })
    
    @action(detail=True, methods=['get'])
    def payment_history(self, request, pk=None):
        """
        Historique des paiements d'un locataire
        GET /api/tenants/{id}/payment_history/
        
        À implémenter si tu as un modèle Payment séparé
        """
        tenant = self.get_object()
        
        # Pour le moment, retourner les infos de base
        history = {
            'tenant_id': tenant.id,
            'tenant_name': tenant.full_name,
            'payments_count': tenant.payments_count,
            'total_paid': float(tenant.total_paid),
            'last_payment': tenant.last_payment,
            'next_payment': tenant.next_payment,
            'reliability': tenant.reliability
        }
        
        return Response({
            'success': True,
            'data': history
        })
    
    @action(detail=True, methods=['post'])
    def activate_contract(self, request, pk=None):
        """
        Active le contrat d'un locataire
        POST /api/tenants/{id}/activate_contract/
        """
        tenant = self.get_object()
        tenant.contract_status = 'actif'
        tenant.payment_status = 'en_attente'
        tenant.save()
        
        serializer = self.get_serializer(tenant)
        
        return Response({
            'success': True,
            'message': f'Contrat de {tenant.full_name} activé',
            'data': serializer.data
        })
    
    @action(detail=False, methods=['post'])
    def bulk_send_reminder(self, request):
        """
        Envoie des rappels à plusieurs locataires
        POST /api/tenants/bulk_send_reminder/
        Body: { "tenant_ids": [1, 2, 3] }
        """
        tenant_ids = request.data.get('tenant_ids', [])
        
        if not tenant_ids:
            return Response({
                'success': False,
                'message': 'Aucun locataire sélectionné'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        tenants = Tenant.objects.filter(id__in=tenant_ids)
        count = tenants.count()
        
        # Ici implémenter l'envoi réel des rappels
        
        return Response({
            'success': True,
            'message': f'Rappels envoyés à {count} locataire(s)'
        })
>>>>>>> da64587f (Initial commit - version locale du projet FRONT-END-REAT)
