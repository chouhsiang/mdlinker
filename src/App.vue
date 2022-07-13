<template>
  <div class="layout">
    <div class="summary" v-html="summary"></div>
    <div class="book-container">
      <iframe id="book"></iframe>
    </div>
  </div>
</template>
<script>
const { marked } = require("marked");
export default {
  data() {
    return {
      summary: null,
    };
  },
  created() {
    this.axios.get("SUMMARY.md").then((response) => {
      const mdhtml = marked.parse(response.data);
      const parser = new DOMParser();
      const doc = parser.parseFromString(mdhtml, "text/html");

      this.checkHash(doc);
      this.setSummary(doc);
      this.updateBook();
      this.listenHashChange();
    });
  },
  methods: {
    checkHash(doc) {
      const hash = location.hash.replace(/^#/, "");
      if (hash == "") {
        const findUrl = doc.querySelectorAll("a");
        if (findUrl.length > 0) {
          location.href = "#" + encodeURIComponent(findUrl[0].href);
        }
      }
    },
    setSummary(doc) {
      doc.querySelectorAll("a").forEach((el) => {
        const hash = "#" + encodeURIComponent(el.href);
        el.href = hash;
        if (location.hash == hash) {
          el.classList.add("active");
        }
      });
      this.summary = doc.documentElement.outerHTML;
    },
    updateBook() {
      const hash = location.hash.replace(/^#/, "");
      document.getElementById("book").src = decodeURIComponent(hash);
    },
    updateSummary() {
      document.querySelectorAll(".summary a").forEach((el) => {
        const url = new URL(el.href);
        el.classList.remove("active");
        if (location.hash == url.hash) {
          el.classList.add("active");
        }
      });
    },
    listenHashChange() {
      window.addEventListener(
        "hashchange",
        () => {
          this.updateBook();
          this.updateSummary();
        },
        false
      );
    },
  },
};
</script>
