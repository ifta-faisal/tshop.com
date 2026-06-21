package com.roboxpressbd.service;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import com.roboxpressbd.entity.Order;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.math.BigDecimal;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Service
public class InvoiceService {

    private final TemplateEngine templateEngine;

    public InvoiceService(TemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }

    public byte[] generateInvoicePdf(Order order) {
        try {
            // 1. Prepare Thymeleaf Context
            Context context = new Context();
            
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM d, yyyy")
                    .withZone(ZoneId.systemDefault());

            Map<String, Object> variables = new HashMap<>();
            variables.put("order", order);
            variables.put("formattedDate", formatter.format(order.getCreatedAt()));
            
            // Calculate subtotal, tax, shipping etc.
            BigDecimal subtotal = order.getTotalAmount(); // Simplification
            BigDecimal shipping = BigDecimal.valueOf(150.00); // Fixed for demo, adjust as needed
            BigDecimal total = subtotal.add(shipping);
            BigDecimal tax = total.multiply(BigDecimal.valueOf(0.007)); // Rough example tax

            variables.put("subtotal", subtotal);
            variables.put("shipping", shipping);
            variables.put("total", total);
            variables.put("tax", tax);

            context.setVariables(variables);

            // 2. Render HTML
            String htmlContent = templateEngine.process("invoice", context);

            // 3. Convert HTML to PDF
            try (ByteArrayOutputStream os = new ByteArrayOutputStream()) {
                PdfRendererBuilder builder = new PdfRendererBuilder();
                builder.useFastMode();
                builder.withHtmlContent(htmlContent, "file:///");
                builder.toStream(os);
                builder.run();
                return os.toByteArray();
            }

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to generate invoice PDF", e);
        }
    }
}
