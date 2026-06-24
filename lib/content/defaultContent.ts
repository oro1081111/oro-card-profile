import type { SiteContent } from "@/types/content";

export const defaultContent: SiteContent = {
  profile: {
    displayNameZh: "周允成 / 奧羅",
    displayNameEn: "Yun-Cheng Chou / ORO",
    headline: "AI Product PM × Generative AI Engineer × Board Game Designer",
    subheadline: "把 AI Agent、產品設計與遊戲機制放在一起思考的人",
    shortBio:
      "現任中華數位科技股份有限公司 AI 產品部門 PM，曾任生成式 AI 工程師，畢業於國立陽明交通大學應用數學研究所，副業經營創意奧羅桌遊設計工作室。",
    avatarUrl: "",
    links: [
      {
        label: "Email",
        type: "email",
        url: "mailto:your-email@example.com"
      },
      {
        label: "LinkedIn",
        type: "link",
        url: ""
      },
      {
        label: "工作室網站",
        type: "link",
        url: ""
      },
      {
        label: "Instagram",
        type: "social",
        url: ""
      },
      {
        label: "Facebook",
        type: "social",
        url: ""
      }
    ]
  },
  theme: {
    backgroundColor: "#0F172A",
    textColor: "#F8FAFC",
    primaryColor: "#8B5CF6",
    accentColor: "#22D3EE",
    cardRadius: "24px",
    cardShadow: true,
    fontStyle: "modern"
  },
  cards: [
    {
      id: "ai-product-pm",
      order: 1,
      visible: true,
      title: "AI Product PM",
      subtitle: "企業 AI 產品與 Agent 落地",
      imageUrl: "",
      tags: ["AI產品", "B2B", "Agent"],
      frontColor: "#111827",
      backColor: "#1F2937",
      accentColor: "#8B5CF6",
      textColor: "#FFFFFF",
      shortDescription:
        "目前任職於中華數位科技股份有限公司，擔任 AI 產品部門 PM。",
      detail:
        "我關注 AI 產品規劃、需求整合、流程設計與企業場景落地。對我來說，AI 產品不應該只停留在展示功能，而是要能真正進入使用者的工作流程，並被持續採用。",
      buttons: [
        {
          label: "查看詳細介紹",
          type: "modal",
          target: "detail"
        },
        {
          label: "想聊 AI 產品",
          type: "link",
          target: "mailto:your-email@example.com"
        }
      ]
    },
    {
      id: "generative-ai-engineer",
      order: 2,
      visible: true,
      title: "Generative AI Engineer",
      subtitle: "從技術實作理解生成式 AI",
      imageUrl: "",
      tags: ["生成式AI", "LLM", "AI工程"],
      frontColor: "#1E1B4B",
      backColor: "#312E81",
      accentColor: "#A78BFA",
      textColor: "#FFFFFF",
      shortDescription:
        "曾於台灣智慧技術研發股份有限公司擔任生成式 AI 工程師。",
      detail:
        "我曾負責生成式 AI 相關應用與技術實作，能從工程角度理解模型能力、資料流程、工具串接與產品限制，也能與 PM、設計、業務需求進行轉譯與協作。",
      buttons: [
        {
          label: "查看技術背景",
          type: "modal",
          target: "detail"
        },
        {
          label: "AI 主題交流",
          type: "link",
          target: "mailto:your-email@example.com"
        }
      ]
    },
    {
      id: "applied-mathematics",
      order: 3,
      visible: true,
      title: "Applied Mathematics",
      subtitle: "結構、規則與推理訓練",
      imageUrl: "",
      tags: ["應用數學", "邏輯思維", "問題解構"],
      frontColor: "#064E3B",
      backColor: "#065F46",
      accentColor: "#34D399",
      textColor: "#FFFFFF",
      shortDescription: "畢業於國立陽明交通大學應用數學研究所。",
      detail:
        "應用數學訓練讓我習慣從結構、規則、推理與抽象模型的角度思考問題。這也影響我在 AI 產品、知識系統與遊戲設計上的方法。",
      buttons: [
        {
          label: "我的思考方式",
          type: "modal",
          target: "detail"
        }
      ]
    },
    {
      id: "board-game-designer",
      order: 4,
      visible: true,
      title: "Board Game Designer",
      subtitle: "把抽象概念變成可玩的系統",
      imageUrl: "",
      tags: ["桌遊設計", "GameDesign", "原創作品"],
      frontColor: "#7C2D12",
      backColor: "#9A3412",
      accentColor: "#FDBA74",
      textColor: "#FFFFFF",
      shortDescription: "副業擔任桌遊設計師，持續進行原創桌遊設計。",
      detail:
        "我將桌遊設計視為一種規則設計與互動設計。好的遊戲需要清楚的行動選項、即時回饋、可理解的目標，以及讓人願意持續參與的體驗。",
      buttons: [
        {
          label: "查看桌遊作品",
          type: "link",
          target: ""
        },
        {
          label: "查看詳細介紹",
          type: "modal",
          target: "detail"
        }
      ]
    },
    {
      id: "oro-board-game-studio",
      order: 5,
      visible: true,
      title: "創意奧羅桌遊設計工作室",
      subtitle: "原創桌遊與互動體驗設計",
      imageUrl: "",
      tags: ["工作室", "OriginalGames", "教育桌遊"],
      frontColor: "#581C87",
      backColor: "#6B21A8",
      accentColor: "#D8B4FE",
      textColor: "#FFFFFF",
      shortDescription: "以奧羅為品牌，經營原創桌遊設計工作室。",
      detail:
        "創意奧羅桌遊設計工作室關注家庭、派對、策略、謎題與教育類型的桌遊設計，也持續探索桌遊工作坊、教學活動與原創遊戲開發。",
      buttons: [
        {
          label: "前往工作室網站",
          type: "link",
          target: ""
        },
        {
          label: "代表作品",
          type: "modal",
          target: "detail"
        }
      ]
    },
    {
      id: "ai-game-thinking",
      order: 6,
      visible: true,
      title: "AI × Game Thinking",
      subtitle: "讓 AI Agent 像好遊戲一樣容易互動",
      imageUrl: "",
      tags: ["AIAgent", "遊戲化", "互動設計"],
      frontColor: "#0E7490",
      backColor: "#155E75",
      accentColor: "#67E8F9",
      textColor: "#FFFFFF",
      shortDescription: "我關注 AI Agent 與遊戲設計的交集。",
      detail:
        "一個好的 AI 產品，應該像一款設計良好的遊戲：規則清楚、行動明確、回饋即時，並且讓使用者知道下一步該做什麼。我正在思考如何把這種設計方法應用到 AI 產品中。",
      buttons: [
        {
          label: "我的核心觀點",
          type: "modal",
          target: "detail"
        },
        {
          label: "想聊這個主題",
          type: "link",
          target: "mailto:your-email@example.com"
        }
      ]
    },
    {
      id: "lets-talk",
      order: 7,
      visible: true,
      title: "Let’s Talk",
      subtitle: "AI、產品、桌遊與合作交流",
      imageUrl: "",
      tags: ["Contact", "Networking", "Collaboration"],
      frontColor: "#BE123C",
      backColor: "#9F1239",
      accentColor: "#FDA4AF",
      textColor: "#FFFFFF",
      shortDescription:
        "如果你想聊 AI Agent、企業 AI、產品管理或桌遊設計，歡迎聯絡我。",
      detail:
        "歡迎找我交流 AI Agent、企業 AI、AI PM、生成式 AI 工程、桌遊設計、教育遊戲、工作坊、講座或跨界合作。",
      buttons: [
        {
          label: "Email 聯絡",
          type: "link",
          target: "mailto:your-email@example.com"
        },
        {
          label: "LinkedIn",
          type: "link",
          target: ""
        }
      ]
    }
  ]
};
