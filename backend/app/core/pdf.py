import os
from datetime import datetime
from typing import List, Dict, Any
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from app.core.config import settings

class PDFService:
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self.output_dir = settings.PDF_OUTPUT_DIR
        os.makedirs(self.output_dir, exist_ok=True)
    
    def _create_header(self, title: str) -> List:
        """Crear el encabezado del documento."""
        elements = []
        
        # Título
        elements.append(Paragraph(title, self.styles['Heading1']))
        elements.append(Spacer(1, 12))
        
        # Información de la empresa
        elements.append(Paragraph("AMACARS - Taller Mecánico", self.styles['Heading2']))
        elements.append(Paragraph(settings.COMPANY_ADDRESS, self.styles['Normal']))
        elements.append(Paragraph(f"Tel: {settings.COMPANY_PHONE}", self.styles['Normal']))
        elements.append(Paragraph(settings.COMPANY_EMAIL, self.styles['Normal']))
        elements.append(Spacer(1, 20))
        
        return elements
    
    def generate_presupuesto(
        self,
        presupuesto_id: int,
        cliente: Dict[str, Any],
        vehiculo: Dict[str, Any],
        servicios: List[Dict[str, Any]],
        total: float,
        notas: str = None
    ) -> str:
        """Generar PDF de presupuesto."""
        filename = f"presupuesto_{presupuesto_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        filepath = os.path.join(self.output_dir, filename)
        
        doc = SimpleDocTemplate(filepath, pagesize=letter)
        elements = []
        
        # Encabezado
        elements.extend(self._create_header("PRESUPUESTO"))
        
        # Información del cliente
        elements.append(Paragraph("Datos del Cliente:", self.styles['Heading3']))
        elements.append(Paragraph(f"Nombre: {cliente['nombre']}", self.styles['Normal']))
        elements.append(Paragraph(f"Email: {cliente['email']}", self.styles['Normal']))
        elements.append(Spacer(1, 12))
        
        # Información del vehículo
        elements.append(Paragraph("Datos del Vehículo:", self.styles['Heading3']))
        elements.append(Paragraph(f"Marca: {vehiculo['marca']}", self.styles['Normal']))
        elements.append(Paragraph(f"Modelo: {vehiculo['modelo']}", self.styles['Normal']))
        elements.append(Paragraph(f"Placa: {vehiculo['placa']}", self.styles['Normal']))
        elements.append(Spacer(1, 12))
        
        # Tabla de servicios
        data = [['Servicio', 'Descripción', 'Precio']]
        for servicio in servicios:
            data.append([
                servicio['nombre'],
                servicio['descripcion'],
                f"${servicio['precio']:.2f}"
            ])
        
        table = Table(data, colWidths=[2*inch, 3*inch, 1*inch])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 10),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        elements.append(table)
        elements.append(Spacer(1, 12))
        
        # Total
        elements.append(Paragraph(f"Total: ${total:.2f}", self.styles['Heading3']))
        
        # Notas
        if notas:
            elements.append(Spacer(1, 12))
            elements.append(Paragraph("Notas:", self.styles['Heading3']))
            elements.append(Paragraph(notas, self.styles['Normal']))
        
        # Validez
        elements.append(Spacer(1, 12))
        elements.append(Paragraph(
            "Este presupuesto tiene una validez de 30 días a partir de la fecha de emisión.",
            self.styles['Italic']
        ))
        
        doc.build(elements)
        return filepath
    
    def generate_informe_servicio(
        self,
        historial_id: int,
        cliente: Dict[str, Any],
        vehiculo: Dict[str, Any],
        servicios: List[Dict[str, Any]],
        tecnico: Dict[str, Any],
        fecha: datetime,
        observaciones: str = None
    ) -> str:
        """Generar PDF de informe de servicio."""
        filename = f"informe_servicio_{historial_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        filepath = os.path.join(self.output_dir, filename)
        
        doc = SimpleDocTemplate(filepath, pagesize=letter)
        elements = []
        
        # Encabezado
        elements.extend(self._create_header("INFORME DE SERVICIO"))
        
        # Fecha
        elements.append(Paragraph(f"Fecha: {fecha.strftime('%d/%m/%Y')}", self.styles['Normal']))
        elements.append(Spacer(1, 12))
        
        # Información del cliente y vehículo
        elements.append(Paragraph("Cliente:", self.styles['Heading3']))
        elements.append(Paragraph(f"Nombre: {cliente['nombre']}", self.styles['Normal']))
        elements.append(Spacer(1, 12))
        
        elements.append(Paragraph("Vehículo:", self.styles['Heading3']))
        elements.append(Paragraph(f"Marca: {vehiculo['marca']}", self.styles['Normal']))
        elements.append(Paragraph(f"Modelo: {vehiculo['modelo']}", self.styles['Normal']))
        elements.append(Paragraph(f"Placa: {vehiculo['placa']}", self.styles['Normal']))
        elements.append(Spacer(1, 12))
        
        # Servicios realizados
        elements.append(Paragraph("Servicios Realizados:", self.styles['Heading3']))
        for servicio in servicios:
            elements.append(Paragraph(f"• {servicio['nombre']}", self.styles['Normal']))
            elements.append(Paragraph(f"  Descripción: {servicio['descripcion']}", self.styles['Normal']))
            if servicio.get('observaciones'):
                elements.append(Paragraph(f"  Observaciones: {servicio['observaciones']}", self.styles['Normal']))
            elements.append(Spacer(1, 6))
        
        # Técnico
        elements.append(Spacer(1, 12))
        elements.append(Paragraph("Técnico Responsable:", self.styles['Heading3']))
        elements.append(Paragraph(f"Nombre: {tecnico['nombre']}", self.styles['Normal']))
        
        # Observaciones generales
        if observaciones:
            elements.append(Spacer(1, 12))
            elements.append(Paragraph("Observaciones Generales:", self.styles['Heading3']))
            elements.append(Paragraph(observaciones, self.styles['Normal']))
        
        doc.build(elements)
        return filepath

pdf_service = PDFService() 