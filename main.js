document
  .getElementById("pdfForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const pdfFile = document.getElementById("pdfFile").files[0];
    const pageRange = document.getElementById("pageRange").value;
    const output = document.getElementById("output");

    if (!pdfFile || !pageRange) {
      output.textContent =
        "Per favore carica un PDF e inserisci un intervallo di pagine.";
      return;
    }

    try {
      // Leggi il file PDF
      const fileBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFLib.PDFDocument.load(fileBuffer);

      // Crea un nuovo PDF
      const newPdf = await PDFLib.PDFDocument.create();
      const pages = pageRange.split(",").flatMap((range) => {
        const [start, end] = range.split("-").map(Number);
        return end
          ? Array.from({ length: end - start + 1 }, (_, i) => start + i)
          : [start];
      });

      // Aggiungi le pagine selezionate
      for (const pageIndex of pages) {
        if (pageIndex > 0 && pageIndex <= pdfDoc.getPageCount()) {
          const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageIndex - 1]);
          newPdf.addPage(copiedPage);
        }
      }

      // Genera il PDF
      const pdfBytes = await newPdf.save();

      // Crea un link per scaricare il PDF
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "estratto.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      output.textContent = "PDF creato con successo!";
    } catch (error) {
      console.error(error);
      output.textContent = "Errore durante l'elaborazione del PDF.";
    }
  });
