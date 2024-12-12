from PyPDF2 import PdfReader, PdfWriter

# Leggi il file PDF
reader = PdfReader("input.pdf")
writer = PdfWriter()

# Aggiungi le pagine desiderate (es. dalla 1 alla 3)
for page_num in range(0, 3):  # Gli indici iniziano da 0
    writer.add_page(reader.pages[page_num])

# Salva il nuovo PDF
with open("output.pdf", "wb") as output_file:
    writer.write(output_file)
    
