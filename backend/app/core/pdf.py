import os
from datetime import datetime
from pathlib import Path
from typing import List, Optional
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from app.core.config import settings

class PDFService:
    def __init__(self):
        # Asegurar que el directorio de salida exista
        self.output_dir = Path(settings.PDF_OUTPUT_DIR)
        self.output_dir.mkdir(exist_ok=True)
        
        # Configuración de la empresa
        self.company_name = settings.COMPANY_NAME
        self.company_address = settings.COMPANY_ADDRESS
        self.company_phone = settings.COMPANY_PHONE
        self.company_email = settings.COMPANY_EMAIL
        
        # Estilos
        self.styles = getSampleStyleSheet()
        self.title_style = ParagraphStyle(
            'CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            spaceAfter=30
        )
        self.header_style = ParagraphStyle(
            'CustomHeader',
            parent=self.styles['Heading2'],
            fontSize=14,
            spaceAfter=12
        )
        self.normal_style = self.styles['Normal']
    
    def _create_header(self, doc_type: str, doc_number: str) -> List:
        """Crear el encabezado del documento."""
        elements = []
        
        # Título
        elements.append(Paragraph(f"{doc_type} #{doc_number}", self.title_style))
        
        # Información de la empresa
        elements.append(Paragraph(self.company_name, self.header_style))
        elements.append(Paragraph(self.company_address, self.normal_style))
        elements.append(Paragraph(self.company_phone, self.normal_style))
        elements.append(Paragraph(self.company_email, self.normal_style))
        elements.append(Spacer(1, 20))
        
        return elements
    
    def generate_presupuesto(
        self,
        presupuesto_id: int,
        cliente_nombre: str,
        fecha: datetime,
        servicios: List[dict],
        total: float,
        notas: Optional[str] = None
    ) -> str:
        """Generar PDF de presupuesto."""
        filename = f"presupuesto_{presupuesto_id}_{fecha.strftime('%Y%m%d')}.pdf"
        filepath = self.output_dir / filename
        
        doc = SimpleDocTemplate(
            str(filepath),
            pagesize=letter,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=72
        )
        
        elements = []
        
        # Encabezado
        elements.extend(self._create_header("Presupuesto", str(presupuesto_id)))
        
        # Información del cliente
        elements.append(Paragraph("Información del Cliente", self.header_style))
        elements.append(Paragraph(f"Cliente: {cliente_nombre}", self.normal_style))
        elements.append(Paragraph(f"Fecha: {fecha.strftime('%d/%m/%Y')}", self.normal_style))
        elements.append(Spacer(1, 20))
        
        # Tabla de servicios
        data = [["Servicio", "Descripción", "Precio"]]
        for servicio in servicios:
            data.append([
                servicio.get("nombre", ""),
                servicio.get("descripcion", ""),
                f"€{servicio.get('precio', 0):.2f}"
            ])
        
        # Agregar total
        data.append(["", "Total", f"€{total:.2f}"])
        
        table = Table(data, colWidths=[2*inch, 3*inch, 1.5*inch])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 14),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, -1), (-1, -1), colors.beige),
            ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 12),
            ('ALIGN', (-1, 0), (-1, -1), 'RIGHT'),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        elements.append(table)
        elements.append(Spacer(1, 20))
        
        # Notas
        if notas:
            elements.append(Paragraph("Notas:", self.header_style))
            elements.append(Paragraph(notas, self.normal_style))
        
        # Construir el documento
        doc.build(elements)
        return str(filepath)

    def generate_factura(
        self,
        factura_id: int,
        cliente_nombre: str,
        fecha: datetime,
        servicios: List[dict],
        total: float,
        metodo_pago: str,
        notas: Optional[str] = None
    ) -> str:
        """Generar PDF de factura."""
        filename = f"factura_{factura_id}_{fecha.strftime('%Y%m%d')}.pdf"
        filepath = self.output_dir / filename
        
        doc = SimpleDocTemplate(
            str(filepath),
            pagesize=letter,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=72
        )
        
        elements = []
        
        # Encabezado
        elements.extend(self._create_header("Factura", str(factura_id)))
        
        # Información del cliente y factura
        elements.append(Paragraph("Detalles de Facturación", self.header_style))
        elements.append(Paragraph(f"Cliente: {cliente_nombre}", self.normal_style))
        elements.append(Paragraph(f"Fecha: {fecha.strftime('%d/%m/%Y')}", self.normal_style))
        elements.append(Paragraph(f"Método de Pago: {metodo_pago}", self.normal_style))
        elements.append(Spacer(1, 20))
        
        # Tabla de servicios
        data = [["Servicio", "Descripción", "Precio"]]
        for servicio in servicios:
            data.append([
                servicio.get("nombre", ""),
                servicio.get("descripcion", ""),
                f"€{servicio.get('precio', 0):.2f}"
            ])
        
        # Agregar total
        data.append(["", "Total", f"€{total:.2f}"])
        
        table = Table(data, colWidths=[2*inch, 3*inch, 1.5*inch])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 14),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, -1), (-1, -1), colors.beige),
            ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 12),
            ('ALIGN', (-1, 0), (-1, -1), 'RIGHT'),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        elements.append(table)
        elements.append(Spacer(1, 20))
        
        # Notas
        if notas:
            elements.append(Paragraph("Notas:", self.header_style))
            elements.append(Paragraph(notas, self.normal_style))
        
        # Construir el documento
        doc.build(elements)
        return str(filepath)

pdf_service = PDFService() 