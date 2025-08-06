document.getElementById("optionSelect").addEventListener("change", function () {
  const container = document.getElementById("fields-container");
  const selected = this.value;
  container.innerHTML = "";

  // Shared toast handler
  function showClipboardToast(message, type = "info", duration = 3000) {
    const toast = document.getElementById("clipboard-toast");
    const bar = document.getElementById("clipboard-toast-bar");
    const text = document.getElementById("clipboard-toast-text");
    const closeBtn = document.getElementById("clipboard-toast-close");

    text.textContent = message;

    // Reset styles
    toast.className = "position-fixed bottom-0 start-50 translate-middle-x p-3 rounded shadow";
    bar.className = "progress-bar progress-bar-striped progress-bar-animated";
    bar.style.transition = "width 3s linear";

    switch (type) {
      case "success":
        toast.classList.add("bg-success", "text-white");
        bar.classList.add("bg-light");
        break;
      case "error":
        toast.classList.add("bg-danger", "text-white");
        bar.classList.add("bg-white");
        break;
      default:
        toast.classList.add("bg-primary", "text-white");
        bar.classList.add("bg-light");
    }

    toast.style.zIndex = 1055;
    toast.style.minWidth = "300px";
    toast.style.display = "block";

    bar.style.width = "100%";
    void bar.offsetWidth; // Force reflow
    bar.style.width = "0%";

    const hideTimeout = setTimeout(() => {
      toast.style.display = "none";
    }, duration);

    closeBtn.onclick = () => {
      clearTimeout(hideTimeout);
      toast.style.display = "none";
    };
  }

  if (selected === "option1") {
    container.innerHTML = `
      <div class="mb-3">
        <label for="field1" class="form-label">URL</label>
        <input type="text" class="form-control" id="field1" placeholder="Paste URL here">
      </div>
      <div class="d-flex gap-2 justify-content-center mb-3">
        <button type="button" class="btn btn-outline-secondary" id="copy-button" title="Paste URL">
          <i class="bi bi-clipboard"></i>
        </button>
        <button type="button" class="btn btn-primary btn-lg px-4 gap-3">Calculate</button>
      </div>
    `;

    document.getElementById("copy-button").addEventListener("click", async () => {
      try {
        const clipboardText = await navigator.clipboard.readText();
        const inputField = document.getElementById("field1");

        if (!clipboardText.trim()) {
          showClipboardToast("Clipboard is empty.", "error");
          return;
        }

        inputField.value = clipboardText.trim();
        showClipboardToast("URL pasted from clipboard!", "success");
      } catch (err) {
        showClipboardToast("Failed to paste from clipboard.", "error");
        console.error(err);
      }
    });

  } else if (selected === "option2") {
    container.innerHTML = `
      <div class="mb-3">
        <label class="form-label">Upload File</label>
        <label id="drop-zone" class="w-100 p-5 text-center border border-secondary rounded bg-dark text-white" style="cursor: pointer;">
          <input type="file" id="fileInput" accept=".txt,.csv" style="display: none;" />
          <span id="drop-zone-text">Drag & drop a file here or </span>
          <span id="click-to-browse">click to browse</span>
        </label>
      </div>
      <div class="mt-3 text-center" id="fileNameDisplay" style="color: #ccc;"></div>
      <div class="d-grid gap-2 d-sm-flex justify-content-sm-center mt-4">
        <button type="button" class="btn btn-primary btn-lg px-4 gap-3">Calculate</button>
      </div>
    `;

    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('fileInput');
    const fileNameDisplay = document.getElementById('fileNameDisplay');

    dropZone.addEventListener('click', () => fileInput.click());

    ['dragenter', 'dragover'].forEach(event => {
      dropZone.addEventListener(event, e => {
        e.preventDefault();
        dropZone.classList.add('border-primary');
        dropZone.classList.remove('border-secondary');
      });
    });

    ['dragleave', 'drop'].forEach(event => {
      dropZone.addEventListener(event, e => {
        e.preventDefault();
        dropZone.classList.remove('border-primary');
        dropZone.classList.add('border-secondary');
      });
    });

    dropZone.addEventListener('drop', e => {
      if (e.dataTransfer.files.length > 0) {
        fileInput.files = e.dataTransfer.files;
        fileNameDisplay.textContent = `Selected file: ${e.dataTransfer.files[0].name}`;
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        fileNameDisplay.textContent = `Selected file: ${fileInput.files[0].name}`;
      }
    });

  } else if (selected === "option3") {
    container.innerHTML = `
      <div class="mb-3">
        <label class="form-label">Commander</label>
        <div class="row g-2 align-items-start" id="commander-row">
          <div class="col-md-8" id="commander-input-col">
            <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="Atraxa, Praetors' Voice" />
          </div>
          <div class="col-md-2 d-grid" id="partner-button-col">
            <button class="btn btn-outline-secondary" type="button" id="add-partner">Add Partner</button>
          </div>
          <div class="col-md-2 d-grid" id="companion-button-col">
            <button class="btn btn-outline-secondary" type="button" id="add-companion">Add Companion</button>
          </div>
        </div>
      </div>

      <div id="additional-commanders"></div>

      <div class="mb-3">
        <label class="form-label">Deck List</label>
        <textarea class="form-control" id="exampleFormControlTextarea1" rows="10" placeholder="1 Sol Ring\n1 Command Tower\n5 Islands\n..."></textarea>
      </div>

      <div class="d-flex gap-2 justify-content-center mb-3">
        <button type="button" class="btn btn-outline-secondary" id="copy-button" title="Paste Commander, Partner, Companion & Deck List">
          <i class="bi bi-clipboard"></i>
        </button>
        <button type="button" class="btn btn-primary btn-lg px-4 gap-3">Calculate</button>
      </div>
    `;

    const additionalContainer = document.getElementById("additional-commanders");

    function updateCommanderLayout() {
      const hasPartner = !!document.getElementById("partner-wrapper");
      const hasCompanion = !!document.getElementById("companion-wrapper");
      const inputCol = document.getElementById("commander-input-col");
      const partnerCol = document.getElementById("partner-button-col");
      const companionCol = document.getElementById("companion-button-col");

      inputCol.classList.toggle("col-md-8", !(hasPartner && hasCompanion));
      inputCol.classList.toggle("col-12", hasPartner && hasCompanion);
      partnerCol.classList.toggle("d-none", hasPartner);
      companionCol.classList.toggle("d-none", hasCompanion);
    }

    function addPartnerField() {
      if (document.getElementById("partner-wrapper")) return;
      additionalContainer.insertAdjacentHTML("beforeend", `
        <div class="mb-3" id="partner-wrapper">
          <label class="form-label">Partner</label>
          <div class="input-group">
            <input type="text" class="form-control" placeholder="Thrasios, Triton Hero" />
            <button class="btn btn-outline-danger" type="button" id="remove-partner">−</button>
          </div>
        </div>
      `);
      document.getElementById("remove-partner").onclick = () => {
        document.getElementById("partner-wrapper").remove();
        updateCommanderLayout();
      };
      updateCommanderLayout();
    }

    function addCompanionField() {
      if (document.getElementById("companion-wrapper")) return;
      additionalContainer.insertAdjacentHTML("beforeend", `
        <div class="mb-3" id="companion-wrapper">
          <label class="form-label">Companion</label>
          <div class="input-group">
            <input type="text" class="form-control" placeholder="Lurrus of the Dream-Den" />
            <button class="btn btn-outline-danger" type="button" id="remove-companion">−</button>
          </div>
        </div>
      `);
      document.getElementById("remove-companion").onclick = () => {
        document.getElementById("companion-wrapper").remove();
        updateCommanderLayout();
      };
      updateCommanderLayout();
    }

    document.getElementById("add-partner").onclick = addPartnerField;
    document.getElementById("add-companion").onclick = addCompanionField;

    document.getElementById("copy-button").addEventListener("click", async () => {
      try {
        const text = await navigator.clipboard.readText();
        if (!text.trim()) {
          showClipboardToast("Clipboard is empty.", "error");
          return;
        }

        const commanderInput = document.getElementById("exampleFormControlInput1");
        const deckTextarea = document.getElementById("exampleFormControlTextarea1");

        const lines = text.split("\n");
        let deckLines = [];

        for (let line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("Commander:")) {
            commanderInput.value = trimmed.replace("Commander:", "").trim();
          } else if (trimmed.startsWith("Partner:")) {
            addPartnerField();
            document.querySelector("#partner-wrapper input").value = trimmed.replace("Partner:", "").trim();
          } else if (trimmed.startsWith("Companion:")) {
            addCompanionField();
            document.querySelector("#companion-wrapper input").value = trimmed.replace("Companion:", "").trim();
          } else if (trimmed && !trimmed.startsWith("Deck List:")) {
            deckLines.push(trimmed);
          }
        }

        if (deckLines.length) {
          deckTextarea.value = deckLines.join("\n");
        }

        showClipboardToast("Commander and deck list pasted!", "success");
      } catch (err) {
        console.error(err);
        showClipboardToast("Failed to read clipboard.", "error");
      }
    });
  }
});
