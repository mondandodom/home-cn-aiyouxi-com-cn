// assets/content-map.js
// 站点内容分区、关键词标签和搜索过滤函数

const siteConfig = {
  baseUrl: "https://home-cn-aiyouxi.com.cn",
  siteName: "爱游戏",
  defaultLang: "zh-CN"
};

const contentSections = [
  {
    id: "news",
    title: "新闻资讯",
    tags: ["爱游戏", "行业动态", "新游发布"],
    items: [
      { title: "爱游戏平台升级公告", date: "2025-03-10", url: "/news/upgrade" },
      { title: "年度游戏评选结果揭晓", date: "2025-03-08", url: "/news/awards" }
    ]
  },
  {
    id: "guides",
    title: "攻略中心",
    tags: ["爱游戏", "新手教程", "高手进阶"],
    items: [
      { title: "新手入门指南", date: "2025-03-05", url: "/guides/newbie" },
      { title: "隐藏关卡解锁方法", date: "2025-03-02", url: "/guides/hidden-level" }
    ]
  },
  {
    id: "community",
    title: "玩家社区",
    tags: ["爱游戏", "论坛", "玩家交流"],
    items: [
      { title: "本周热门讨论", date: "2025-03-09", url: "/community/hot" },
      { title: "玩家创作分享", date: "2025-03-07", url: "/community/creations" }
    ]
  }
];

const allTags = [
  "爱游戏", "行业动态", "新游发布",
  "新手教程", "高手进阶",
  "论坛", "玩家交流"
];

function generateTagLinks(tags) {
  const baseUrl = siteConfig.baseUrl;
  return tags.map(tag => ({
    tag: tag,
    url: baseUrl + "/search?tag=" + encodeURIComponent(tag)
  }));
}

function searchContent(query) {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const results = [];
  contentSections.forEach(section => {
    section.items.forEach(item => {
      const titleMatch = item.title.toLowerCase().includes(q);
      const tagMatch = section.tags.some(t => t.toLowerCase().includes(q));
      if (titleMatch || tagMatch) {
        results.push({
          sectionId: section.id,
          sectionTitle: section.title,
          title: item.title,
          date: item.date,
          url: siteConfig.baseUrl + item.url,
          relevance: (titleMatch ? 2 : 0) + (tagMatch ? 1 : 0)
        });
      }
    });
  });

  results.sort((a, b) => b.relevance - a.relevance);
  return results;
}

function getContentByTag(tag) {
  const tagLower = tag.toLowerCase().trim();
  const sections = contentSections.filter(s =>
    s.tags.some(t => t.toLowerCase() === tagLower)
  );

  const items = [];
  sections.forEach(s => {
    s.items.forEach(item => {
      items.push({
        sectionTitle: s.title,
        title: item.title,
        date: item.date,
        url: siteConfig.baseUrl + item.url,
        tag: tag
      });
    });
  });
  return items;
}

function renderTagCloud() {
  const tagLinks = generateTagLinks(allTags);
  let html = '<div class="tag-cloud">\n';
  tagLinks.forEach(link => {
    html += `  <a href="${link.url}" class="tag-item">${link.tag}</a>\n`;
  });
  html += '</div>';
  return html;
}

function renderSearchResults(query) {
  const results = searchContent(query);
  if (results.length === 0) {
    return '<p>未找到相关内容。</p>';
  }

  let html = '<ul class="search-results">\n';
  results.forEach(item => {
    html += `  <li>\n`;
    html += `    <a href="${item.url}">${item.title}</a>\n`;
    html += `    <span class="section-tag">[${item.sectionTitle}]</span>\n`;
    html += `    <span class="date">${item.date}</span>\n`;
    html += `  </li>\n`;
  });
  html += '</ul>';
  return html;
}

// 示例调用
console.log("站点配置:", siteConfig);
console.log("搜索 '爱游戏':", searchContent("爱游戏"));
console.log("按标签 '新手教程' 获取内容:", getContentByTag("新手教程"));
console.log("标签云 HTML:\n" + renderTagCloud());
console.log("搜索结果 HTML (查询 '更新'):\n" + renderSearchResults("更新"));