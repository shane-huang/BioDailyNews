const { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } = require('docx');
const fs = require('fs');
const path = require('path');

const data = require('./news_data.json');

function sec(title) {
  return new Paragraph({
    children: [new TextRun({ text: title, bold: true, size: 28, font: 'SimHei', color: '1F4E79' })],
    spacing: { before: 400, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '1F4E79' } }
  });
}

function sub(title) {
  return new Paragraph({
    children: [new TextRun({ text: title, bold: true, size: 24, font: 'SimHei', color: 'C00000' })],
    spacing: { before: 200, after: 100 }
  });
}

function story(title, content) {
  return [
    new Paragraph({
      children: [new TextRun({ text: title, bold: true, size: 22 })],
      spacing: { before: 120, after: 50 }
    }),
    new Paragraph({
      children: [new TextRun({ text: content, size: 20 })],
      spacing: { after: 120 },
      indent: { left: 200 }
    })
  ];
}

function divider() {
  return new Paragraph({
    children: [new TextRun({ text: "\u2501".repeat(60), color: 'CCCCCC', size: 16 })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 100, after: 100 }
  });
}

const children = [
  new Paragraph({
    children: [new TextRun({ text: "BioDailyNews \u00b7 \u751f\u7269\u533b\u836f\u65e5\u62a5", bold: true, size: 36, font: 'SimHei' })],
    alignment: AlignmentType.CENTER, spacing: { after: 150 }
  }),
  new Paragraph({
    children: [new TextRun({ text: "2026\u5e745\u67081\u65e5", size: 24, font: 'SimHei', color: '666666' })],
    alignment: AlignmentType.CENTER, spacing: { after: 300 }
  }),
  divider(),

  // Summary
  new Paragraph({
    children: [new TextRun({ text: "\u3010\u672c\u671f\u6458\u8981\u3011", bold: true, size: 24, font: 'SimHei' })],
    spacing: { after: 100 }
  }),
  new Paragraph({
    children: [new TextRun({
      text: "\u672c\u671fBioDailyNews\u6c47\u603b2026\u5e744\u670827\u65e5\u81f35\u67081\u65e5\u5168\u7403\u751f\u7269\u533b\u836f\u884c\u4e1a\u6838\u5fc3\u8d44\u8baf\u3002" +
        "\u521b\u65b0\u836f\u7814\u53d1\u9886\u57df\u4eae\u70b9\u5bc6\u96c6\uff1aIntellia CRISPR\u4f53\u5185\u57fa\u56e0\u7f16\u8f91\u836f\u72693\u671f\u4e34\u5e8a\u6210\u529f\uff0c\u52c3\u6797\u683c\u80a5\u80d6\u65b0\u836fSurvodutide\u8fbe\u7ec8\u70b9\uff1b" +
        "M&A\u5e02\u573a\u6301\u7eed\u6d3b\u8dc3\uff0c\u672c\u5468\u51fa\u73b05\u8d77\u751f\u7269\u6280\u672f\u6536\u8d2d\uff08Teva-Emalex\u3001Chiesi-KalVista\u7b49\uff09\uff0cLilly\u5bc6\u96c6\u5e03\u5c40\u4f53\u5185\u7ec6\u80de\u6cbb\u7597\u548cADC\u9886\u57df\uff1b" +
        "\u8d44\u672c\u5e02\u573a\u65b9\u9762\uff0cSeaport\u3001Hemab\u540c\u65e5IPO\u5408\u8ba1\u52df\u8d44\u8d855.5\u4ebf\u7f8e\u5143\uff0c2026\u5e74\u751f\u7269\u6280\u672fIPO\u603b\u989d\u903c\u8fd132\u4ebf\u7f8e\u5143\uff1b" +
        "\u5236\u836f\u5de8\u5934Q1\u8d22\u62a5\u5b63\u8fdb\u884c\u4e2d\uff0cLilly\u4e1a\u7ee9\u518d\u521b\u7eaa\u5f55\uff0cBMS\u65b0\u4ea7\u54c1\u6536\u5165\u9996\u6b21\u8d85\u8fc7\u4f20\u7edf\u7ba1\u7ebf\u3002",
      size: 21
    })],
    spacing: { after: 200 }
  }),
  divider(),
];

// Build sections
for (const secData of data.sections) {
  children.push(sec(secData.title));
  
  // Global stories
  for (const s of secData.stories) {
    children.push(...story(s.title, s.content));
  }

  // Chinese market sub-section
  children.push(sub("\u3010\u4e2d\u56fd\u5e02\u573a\u7279\u522b\u5173\u6ce8\u3011"));
  for (const s of secData.china) {
    children.push(...story(s.title, s.content));
  }
}

// Footer
children.push(
  new Paragraph({ spacing: { before: 400 }, children: [] }),
  divider(),
  new Paragraph({
    children: [new TextRun({
      text: "BioDailyNews \u00b7 \u6bcf\u65e5\u751f\u7269\u533b\u836f\u884c\u4e1a\u8d44\u8baf | \u751f\u6210\u65f6\u95f4: 2026-05-01 | \u6570\u636e\u6765\u6e90: BioPharma Dive, Fierce Biotech, Fierce Pharma",
      size: 16, color: '999999', italics: true
    })],
    alignment: AlignmentType.CENTER
  })
);

const doc = new Document({
  sections: [{
    properties: { page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } } },
    children
  }]
});

const outputPath = path.join(__dirname, 'BioDailyNews-2026-05-01.docx');
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outputPath, buffer);
  console.log(`Document generated: ${outputPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
}).catch(err => console.error('Error:', err));
