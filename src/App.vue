<template>
  <div class="layout">
    <div class="sidebar">
      <div class="toolbar">
        <div class="form-group input-group-sm search">
          <input class="form-control" placeholder="Search title..." />
        </div>
        <a class="btn" href="javascript:location.reload()">
          <i class="fa fa-refresh" aria-hidden="true"></i>
        </a>
        <div class="btn" @click="collapse(true)">
          <i class="fa fa-angle-double-left" aria-hidden="true"></i>
        </div>
      </div>
      <div class="summary" v-html="summary"></div>
    </div>
    <div class="sidebar-hide">
      <div class="btn" @click="collapse(false)">
        <span>Expand menu </span>
        <i class="fa fa-angle-double-right" aria-hidden="true"></i>
      </div>
    </div>
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
    if (screen.width < 767) {
      document.getElementById("app").classList.add("sidebar-collapse");
    }

    this.axios.get("SUMMARY.md").then((response) => {
      const mdhtml = marked.parse(response.data);
      const parser = new DOMParser();
      const doc = parser.parseFromString(mdhtml, "text/html");

      this.checkHash(doc);
      this.renderSummary(doc);
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
    renderSummary(doc) {
      doc.querySelectorAll('a:not([target="_blank"])').forEach((el) => {
        const hash =  encodeURIComponent(el.href);
        el.href = "#" + hash;
        el.id = hash;
        if (location.hash == "#" + hash) {
          el.classList.add("active");
          document.title = el.textContent;
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
          document.title = el.textContent;
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
    collapse(enable) {
      if (enable) {
        document.getElementById("app").classList.add("sidebar-collapse");
      } else {
        document.getElementById("app").classList.remove("sidebar-collapse");
      }
    },
  },
};
</script>
