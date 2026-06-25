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
    backgroundColor: "#111827",
    textColor: "#F8FAFC",
    primaryColor: "#F97316",
    accentColor: "#67E8F9",
    cardRadius: "24px",
    cardShadow: true,
    fontStyle: "modern"
  },
  cards: [
    {
      id: "board-game-designer",
      order: 1,
      visible: true,
      title: "桌遊設計師",
      subtitle: "把概念變成能被玩懂的系統",
      imageUrl: "",
      tags: ["桌遊設計", "規則設計", "原創作品"],
      frontColor: "#0F766E",
      backColor: "#0F766E",
      accentColor: "#99F6E4",
      textColor: "#FFFFFF",
      shortDescription:
        "以規則、回饋與玩家選擇為核心，設計能被理解、願意重玩的互動體驗。",
      detail:
        "我把桌遊設計視為一種嚴謹的互動設計：玩家要看得懂目標、做得出選擇、感受到回饋，並在每一輪行動中產生新的判斷。這份訓練也延伸到我設計產品流程、AI Agent 與使用者體驗的方式。",
      buttons: []
    },
    {
      id: "ai-product-manager",
      order: 2,
      visible: true,
      title: "AI 產品經理",
      subtitle: "讓 AI 進入真實工作流程",
      imageUrl: "",
      tags: ["AI產品", "B2B", "Agent落地"],
      frontColor: "#2563EB",
      backColor: "#2563EB",
      accentColor: "#BFDBFE",
      textColor: "#FFFFFF",
      shortDescription:
        "現任 AI 產品部門 PM，負責把需求、技術能力與企業場景整理成可落地的產品方向。",
      detail:
        "我關注的不是單一 AI 功能展示，而是它能不能被放進使用者每天真的會走的流程裡。從需求訪談、情境拆解、功能優先序到導入後回饋，我希望 AI 產品能降低摩擦、提高採用率，並持續創造可被看見的價值。",
      buttons: [
        {
          label: "交流 AI 產品",
          type: "link",
          target: "mailto:your-email@example.com"
        }
      ]
    },
    {
      id: "ai-engineer",
      order: 3,
      visible: true,
      title: "AI Engineer",
      subtitle: "從工程實作理解 AI 能力邊界",
      imageUrl: "",
      tags: ["生成式AI", "LLM", "系統整合"],
      frontColor: "#0891B2",
      backColor: "#0891B2",
      accentColor: "#A5F3FC",
      textColor: "#FFFFFF",
      shortDescription:
        "曾任生成式 AI 工程師，熟悉模型應用、資料流程、工具串接與產品化限制。",
      detail:
        "工程背景讓我能用更具體的方式評估 AI 產品：資料從哪裡來、模型能做什麼、限制在哪裡、錯誤如何被處理，以及使用者該如何信任輸出。這讓我在 PM 與工程之間能更精準地轉譯需求。",
      buttons: []
    },
    {
      id: "math-graduate-school",
      order: 4,
      visible: true,
      title: "數學研究所",
      subtitle: "用結構與推理拆解複雜問題",
      imageUrl: "",
      tags: ["應用數學", "邏輯推理", "問題建模"],
      frontColor: "#16A34A",
      backColor: "#16A34A",
      accentColor: "#BBF7D0",
      textColor: "#FFFFFF",
      shortDescription:
        "畢業於國立陽明交通大學應用數學研究所，擅長以結構化方式理解問題。",
      detail:
        "數學訓練讓我習慣先找規則、定義變數、拆出關係，再決定如何行動。無論是 AI 產品、Agent 流程還是桌遊機制，我都會先建立問題的骨架，讓後續設計更清楚、更可驗證。",
      buttons: []
    }
  ]
};
