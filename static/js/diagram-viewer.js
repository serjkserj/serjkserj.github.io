(function () {
  const overlayId = 'diagram-viewer-overlay';
  let currentScale = 1;

  function ensureOverlay() {
    let overlay = document.getElementById(overlayId);
    if (overlay) {
      return overlay;
    }

    overlay = document.createElement('div');
    overlay.id = overlayId;
    overlay.className = 'diagram-viewer';
    overlay.innerHTML = `
      <div class="diagram-viewer__backdrop"></div>
      <div class="diagram-viewer__dialog" role="dialog" aria-modal="true" aria-label="Просмотр диаграммы">
        <div class="diagram-viewer__toolbar">
          <div class="diagram-viewer__title">Просмотр диаграммы</div>
          <div class="diagram-viewer__actions">
            <button type="button" class="diagram-viewer__button" data-action="zoom-out">−</button>
            <button type="button" class="diagram-viewer__button" data-action="reset">100%</button>
            <button type="button" class="diagram-viewer__button" data-action="zoom-in">+</button>
            <button type="button" class="diagram-viewer__button" data-action="close">Закрыть</button>
          </div>
        </div>
        <div class="diagram-viewer__viewport">
          <div class="diagram-viewer__canvas"></div>
        </div>
      </div>
    `;

    const canvas = overlay.querySelector('.diagram-viewer__canvas');
    const close = () => overlay.classList.remove('is-open');
    const updateScale = () => {
      canvas.style.transform = `scale(${currentScale})`;
    };

    overlay.querySelector('[data-action="zoom-in"]').addEventListener('click', function () {
      currentScale = Math.min(3, +(currentScale + 0.2).toFixed(2));
      updateScale();
    });

    overlay.querySelector('[data-action="zoom-out"]').addEventListener('click', function () {
      currentScale = Math.max(0.4, +(currentScale - 0.2).toFixed(2));
      updateScale();
    });

    overlay.querySelector('[data-action="reset"]').addEventListener('click', function () {
      currentScale = 1;
      updateScale();
    });

    overlay.querySelector('[data-action="close"]').addEventListener('click', close);
    overlay.querySelector('.diagram-viewer__backdrop').addEventListener('click', close);

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        close();
      }
    });

    document.body.appendChild(overlay);
    return overlay;
  }

  function openDiagramView(svg) {
    if (!svg) {
      return;
    }

    const overlay = ensureOverlay();
    const canvas = overlay.querySelector('.diagram-viewer__canvas');
    canvas.innerHTML = '';
    canvas.appendChild(svg.cloneNode(true));
    currentScale = 1;
    canvas.style.transform = 'scale(1)';
    overlay.classList.add('is-open');
  }

  function enhanceDiagram(wrapper) {
    if (wrapper.dataset.viewerReady === '1') {
      return;
    }

    wrapper.dataset.viewerReady = '1';
    const toolbar = document.createElement('div');
    toolbar.className = 'diagram-toolbar';

    const expand = document.createElement('button');
    expand.type = 'button';
    expand.className = 'diagram-expand-button';
    expand.textContent = 'Развернуть';
    expand.addEventListener('click', function () {
      openDiagramView(wrapper.querySelector('svg'));
    });

    toolbar.appendChild(expand);
    wrapper.prepend(toolbar);
  }

  function scan(root) {
    root.querySelectorAll('.theme-mermaid').forEach(enhanceDiagram);
  }

  function boot() {
    scan(document);
    const observer = new MutationObserver(function () {
      scan(document);
    });
    observer.observe(document.body, {childList: true, subtree: true});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, {once: true});
  } else {
    boot();
  }
})();
