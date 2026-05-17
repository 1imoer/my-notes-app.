// ===============================
// تطبيق ملاحظاتي اليومية
// ===============================

// نحدد العناصر من الصفحة
const noteInput = document.getElementById("noteInput");
const searchInput = document.getElementById("searchInput");
const saveBtn = document.getElementById("saveBtn");
const clearBtn = document.getElementById("clearBtn");
const notesList = document.getElementById("notesList");
const countBadge = document.getElementById("countBadge");

// مفتاح التخزين المحلي داخل الهاتف
const STORAGE_KEY = "daily_notes_app_v1";

// مصفوفة الملاحظات
let notes = [];

// تحميل الملاحظات من localStorage
function loadNotes() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved) {
    notes = JSON.parse(saved);
  } else {
    notes = [];
  }
}

// حفظ الملاحظات في localStorage
function saveNotesToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

// تنسيق التاريخ بشكل بسيط
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString("ar");
}

// رسم الملاحظات على الصفحة
function renderNotes() {
  const keyword = searchInput.value.trim().toLowerCase();

  // فلترة حسب البحث
  const filteredNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(keyword)
  );

  notesList.innerHTML = "";

  if (filteredNotes.length === 0) {
    notesList.innerHTML = "<p>لا توجد ملاحظات بعد.</p>";
    countBadge.textContent = "0";
    return;
  }

  // نعرض أحدث الملاحظات أولًا
  filteredNotes
    .slice()
    .reverse()
    .forEach((note) => {
      const item = document.createElement("div");
      item.className = "note-item";

      item.innerHTML = `
        <p class="note-text">${escapeHtml(note.text)}</p>
        <div class="note-meta">
          <span>${formatDate(note.createdAt)}</span>
          <div class="note-actions">
            <button class="edit">تعديل</button>
            <button class="delete">حذف</button>
          </div>
        </div>
      `;

      // زر التعديل
      item.querySelector(".edit").addEventListener("click", () => {
        noteInput.value = note.text;
        deleteNote(note.id);
      });

      // زر الحذف
      item.querySelector(".delete").addEventListener("click", () => {
        deleteNote(note.id);
      });

      notesList.appendChild(item);
    });

  countBadge.textContent = filteredNotes.length.toString();
}

// إضافة ملاحظة جديدة
function addNote() {
  const text = noteInput.value.trim();

  if (text === "") {
    alert("اكتب الملاحظة أولًا.");
    return;
  }

  const newNote = {
    id: Date.now(),
    text: text,
    createdAt: new Date().toISOString()
  };

  notes.push(newNote);
  saveNotesToStorage();
  noteInput.value = "";
  renderNotes();
}

// حذف ملاحظة
function deleteNote(id) {
  notes = notes.filter((note) => note.id !== id);
  saveNotesToStorage();
  renderNotes();
}

// مسح الحقل فقط
function clearInput() {
  noteInput.value = "";
  noteInput.focus();
}

// حماية بسيطة جدًا للنص داخل HTML
function escapeHtml(text) {
  const div = document.createElement("div");
  div.innerText = text;
  return div.innerHTML;
}

// الأحداث
saveBtn.addEventListener("click", addNote);
clearBtn.addEventListener("click", clearInput);

// البحث المباشر أثناء الكتابة
searchInput.addEventListener("input", renderNotes);

// دعم زر Enter على الكمبيوتر والهاتف عند اللصق
noteInput.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "Enter") {
    addNote();
  }
});

// تشغيل التطبيق
loadNotes();
renderNotes();