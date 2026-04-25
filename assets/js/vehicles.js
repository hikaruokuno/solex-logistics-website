document.addEventListener('DOMContentLoaded', () => {
  // Public vehicle lineup data. Add new vehicles to this array as needed.
  const vehicles = [
    {
      id: '2t-wide-long',
      name: '2トン車 ワイドロング',
      bodyType: 'ワイドロング / 箱車',
      cardMetaLabel: '内寸',
      cardMetaValue: '約445×207×225cm',
      summary: 'まとまった荷量のスポット輸送や、かさのある荷物の搬送に対応しやすい車両です。',
      suitableFor: ['家電・家具配送', '什器・イベント資材', '拠点間のスポット輸送', '法人向けのまとまった段ボール案件'],
      specs: [
        ['車両名', '2トン車 ワイドロング'],
        ['内寸', '約445×207×225cm'],
        ['掲載写真', '外観・荷室写真あり'],
        ['対応イメージ', 'まとまった荷量・かさのある荷物']
      ],
      features: [
        '荷室高に余裕があり、背の高い資材や什器も積み込みやすい構成です。',
        'まとまった段ボール物量や、かさのある什器・備品の搬送にも向いています。',
        '拠点間輸送やイベント関連のスポット案件など、積載量を確保したい場面で使いやすい車両です。'
      ],
      images: [
        {
          src: '/assets/images/vehicles/2t-wide-long-front-side.jpg',
          alt: '2トン車 ワイドロングの前方斜め外観'
        },
        {
          src: '/assets/images/vehicles/2t-wide-long-rear.jpg',
          alt: '2トン車 ワイドロングの後方外観'
        },
        {
          src: '/assets/images/vehicles/2t-wide-long-cargo-open.jpg',
          alt: '2トン車 ワイドロングの荷室全景'
        },
        {
          src: '/assets/images/vehicles/2t-wide-long-cargo-inside.jpg',
          alt: '2トン車 ワイドロングの荷室内部'
        }
      ]
    },
    {
      id: '2t-short-body',
      name: '2トン車 ショートボディー',
      bodyType: 'ショートボディー / 箱車',
      cardMetaLabel: '荷台寸法',
      cardMetaValue: '約310×177×182cm',
      summary: '市街地での配送や、扱いやすいサイズ感を活かしたスポット輸送に対応しやすい車両です。',
      suitableFor: ['店舗・オフィス配送', '小型什器・備品搬送', '市街地でのスポット輸送', '段ボール・ケース物の配送'],
      specs: [
        ['車両名', '2トン車 ショートボディー'],
        ['荷台寸法', '約310×177×182cm'],
        ['最大積載量', '2,000kg'],
        ['対応イメージ', '市街地配送・小回りが必要な案件']
      ],
      features: [
        'ショートボディーのため、住宅街や市街地などでも取り回しやすい車両です。',
        '段ボールやケース物、小型什器・備品などの配送に向いています。',
        '荷室高も確保されており、高さのある荷物にも対応しやすい構成です。'
      ],
      images: [
        {
          src: '/assets/images/vehicles/2t-short-body-front-side.png',
          alt: '2トン車 ショートボディーの前方斜め外観'
        },
        {
          src: '/assets/images/vehicles/2t-short-body-rear-side.png',
          alt: '2トン車 ショートボディーの後方斜め外観'
        },
        {
          src: '/assets/images/vehicles/2t-short-body-cargo-inside.png',
          alt: '2トン車 ショートボディーの荷室内部'
        }
      ]
    },
    {
      id: '1t-van',
      name: '1トンバン車両',
      bodyType: '1トンバン / 箱型バン',
      cardMetaLabel: '特徴',
      cardMetaValue: '濃いスモーク仕様',
      summary: '荷物を外から見えにくくしながら、雨風を避けて運びたい案件に対応しやすいバンタイプです。',
      suitableFor: ['精密機器・備品配送', 'ルート配送・チャーター便', '荷姿を見せたくない案件', '雨風を避けたい荷物'],
      specs: [
        ['車両名', '1トンバン車両'],
        ['車両タイプ', '1トンクラスの箱型バン'],
        ['特徴', '積載貨物が見えにくい濃いスモーク仕様'],
        ['対応イメージ', '機材・備品・ボックス物の配送']
      ],
      features: [
        '濃いスモークが入っており、積載貨物が外から見えにくい車両です。',
        '箱型バンのため、雨風を避けたい荷物や備品の輸送にも向いています。',
        'ルート配送やチャーター便など、見た目の配慮が必要な案件でも使いやすい構成です。'
      ],
      images: [
        {
          src: '/assets/images/vehicles/1t-van-black-front.png',
          alt: '1トンバン車両の前方斜め外観'
        },
        {
          src: '/assets/images/vehicles/1t-van-black-rear.png',
          alt: '1トンバン車両の後方斜め外観'
        },
        {
          src: '/assets/images/vehicles/1t-van-black-cargo-open.jpg',
          alt: '1トンバン車両の荷室開口部'
        },
        {
          src: '/assets/images/vehicles/1t-van-silver-front.png',
          alt: '1トンバン車両の前方外観（シルバー）'
        },
        {
          src: '/assets/images/vehicles/1t-van-silver-side.png',
          alt: '1トンバン車両の側面外観（シルバー）'
        }
      ]
    },
    {
      id: 'kei-cargo',
      name: '軽貨物車',
      bodyType: '軽バン / 軽貨物',
      cardMetaLabel: '荷室寸法の目安',
      cardMetaValue: '約191.5×127×125cm',
      summary: '小回りの良さを活かして、近距離配送や少量多頻度の案件に対応しやすい軽貨物車です。',
      suitableFor: ['小口配送・宅配', '書類・部品・サンプル便', '都内・住宅街の配送', '緊急スポット便'],
      specs: [
        ['車両名', '軽貨物車'],
        ['荷室寸法の目安', '約191.5×127×125cm（2名乗車時）'],
        ['最大積載量', '350kg'],
        ['対応イメージ', '小口配送・緊急スポット便']
      ],
      features: [
        '軽バンならではの取り回しやすさがあり、住宅街や狭い道路での配送にも向いています。',
        '小口配送や緊急便、書類・部品などの少量案件で使いやすいサイズ感です。',
        '日用品やケース物、書類・部品などの小口案件に幅広く対応しやすい車両です。'
      ],
      images: [
        {
          src: '/assets/images/vehicles/kei-cargo-front-side.png',
          alt: '軽貨物車の前方斜め外観'
        },
        {
          src: '/assets/images/vehicles/kei-cargo-front.png',
          alt: '軽貨物車の前方外観'
        },
        {
          src: '/assets/images/vehicles/kei-cargo-rear-side.png',
          alt: '軽貨物車の後方斜め外観'
        }
      ]
    }
  ];

  const listContainer = document.getElementById('vehicle-list');
  const detailContainer = document.getElementById('vehicle-details');

  if (!listContainer || !detailContainer) return;

  listContainer.innerHTML = vehicles
    .map((vehicle) => {
      const chips = vehicle.suitableFor
        .slice(0, 3)
        .map((item) => `<li class="vehicle-chip">${item}</li>`)
        .join('');

      const metaLabel = vehicle.cardMetaLabel || '内寸';
      const metaValue = vehicle.cardMetaValue || '';

      return `
        <article class="vehicle-card">
          <p class="vehicle-card__type">${vehicle.bodyType}</p>
          <h3 class="vehicle-card__title">${vehicle.name}</h3>
          <p class="vehicle-card__dimension">${metaLabel}: ${metaValue}</p>
          <ul class="vehicle-chip-list">${chips}</ul>
          <a href="#detail-${vehicle.id}" class="vehicle-card__link">詳細を見る</a>
        </article>
      `;
    })
    .join('');

  detailContainer.innerHTML = vehicles
    .map((vehicle) => {
      const specs = vehicle.specs
        .map(
          ([label, value]) => `
            <div class="spec-row">
              <dt>${label}</dt>
              <dd>${value}</dd>
            </div>
          `
        )
        .join('');

      const uses = vehicle.suitableFor
        .map((item) => `<li class="usage-pill">${item}</li>`)
        .join('');

      const featureList = vehicle.features
        .map((item) => `<li>${item}</li>`)
        .join('');

      const thumbs = vehicle.images
        .map(
          (image, imageIndex) => `
            <button
              type="button"
              class="gallery-thumb ${imageIndex === 0 ? 'is-active' : ''}"
              data-gallery-thumb="${vehicle.id}"
              data-image-src="${image.src}"
              data-image-alt="${image.alt}"
              aria-label="${image.alt}"
            >
              <img src="${image.src}" alt="" loading="lazy" />
            </button>
          `
        )
        .join('');

      return `
        <section id="detail-${vehicle.id}" class="vehicle-detail-card">
          <div class="section-divider mb-8">
            <span class="h-3 w-3 rounded-full bg-brand-sky/70 shadow-[0_0_10px_rgba(29,160,230,0.45)]"></span>
            <span class="text-xs font-semibold uppercase tracking-[0.4em] text-brand-ink/50">${vehicle.name}</span>
            <span class="divider-line h-px flex-1"></span>
          </div>
          <div class="vehicle-detail-grid">
            <div class="gallery-panel">
              <div class="gallery-main">
                <img
                  src="${vehicle.images[0].src}"
                  alt="${vehicle.images[0].alt}"
                  id="gallery-main-${vehicle.id}"
                  loading="lazy"
                />
              </div>
              <div class="gallery-thumbs">
                ${thumbs}
              </div>
            </div>
            <div class="vehicle-info-stack">
              <div class="vehicle-info-card">
                <p class="vehicle-info-card__eyebrow">基本スペック</p>
                <h2 class="vehicle-info-card__title">${vehicle.name}</h2>
                <p class="vehicle-info-card__summary">${vehicle.summary}</p>
                <dl class="spec-list">
                  ${specs}
                </dl>
              </div>
              <div class="vehicle-info-card">
                <p class="vehicle-info-card__eyebrow">対応しやすい荷物・用途</p>
                <ul class="usage-pill-list">
                  ${uses}
                </ul>
              </div>
              <div class="vehicle-info-card">
                <p class="vehicle-info-card__eyebrow">補足</p>
                <ul class="vehicle-note-list">
                  ${featureList}
                </ul>
              </div>
              <a
                href="/#contact"
                data-glow
                class="header-cta vehicle-cta inline-flex items-center justify-center gap-2 rounded-full bg-brand-ink px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-sky"
              >
                この車両について問い合わせる
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h13M13 5l7 7-7 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      `;
    })
    .join('');

  document.querySelectorAll('[data-gallery-thumb]').forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-gallery-thumb');
      const imageSrc = button.getAttribute('data-image-src');
      const imageAlt = button.getAttribute('data-image-alt');
      const mainImage = document.getElementById(`gallery-main-${targetId}`);

      if (!mainImage || !imageSrc || !imageAlt) return;

      mainImage.setAttribute('src', imageSrc);
      mainImage.setAttribute('alt', imageAlt);

      document.querySelectorAll(`[data-gallery-thumb="${targetId}"]`).forEach((thumb) => {
        thumb.classList.remove('is-active');
      });
      button.classList.add('is-active');
    });
  });
});
