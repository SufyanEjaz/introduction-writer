// API calls for authentication
import api from '../api/api';

export const login = async (username: string, password: string) => {
  // const response = await api.post('/login', { username, password });
  const response = {
    "id": 1,
    "username": "emilys",
    "email": "emily.johnson@x.dummyjson.com",
    "firstName": "Emily",
    "lastName": "Johnson",
    "gender": "female",
    "image": "https://dummyjson.com/icon/emilys/128",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // JWT accessToken (for backward compatibility) in response and cookies
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // refreshToken in response and cookies
  };
  return response;
};

export const register = async (email: string, password: string, fullName: string, confirm_password: string) => {
  const response = await api.post('/register', { email, password, name: fullName, confirm_password });
  return response.data;
};

export const getIntroduction = async (payload: object) => {
  const response = await api.post('/get-introduction', payload);
  return response.data;
//   return {
//     "intro_outline":{
//        "plan":"**Working Title: Unveiling the Invisible: The Mediating Role of Task and Social Attraction in the Relationship Between Anthropomorphism and Trust in Intelligent Personal Assistants**\n\n**Introduction Outline:**\n\n1. **Opening with a Broad, Compelling Statement:**\n   - Begin with a captivating assertion about the growing prevalence of intelligent personal assistants (IPAs) in modern households and workplaces. Highlight how these digital entities are increasingly anthropomorphized, or attributed human-like qualities, to enhance user interaction and engagement.\n }}  - Example: \"In an era where intelligent personal assistants (IPAs) have become ubiquitous in our daily lives, the human tendency to anthropomorphize these digital companions is reshaping the landscape of human-technology interaction.\"\n\n2. **Historical and Contextual Relevance:**\n   - Discuss the historical context of anthropomorphism in technology, referencing seminal studies that have explored its impact on user engagement and trust. Mention how previous research has primarily focused on explicit interactions, leaving a gap in understanding the psychological processes involved in implicit and transparent interactions with IPAs.\n   - Example: \"Historically, anthropomorphism has been a focal point in understanding user engagement with technology, with studies highlighting its role in enhancing trust and interaction (Nass & Moon, 2000; Reeves & Nass, 1996). However, the psychological processes underpinning these interactions, particularly in implicit and transparent contexts, remain underexplored.\"\n\n3. **Introducing a Critical Contradiction or Research Gap:**\n   - Highlight the research gap concerning the psychological processes by which anthropomorphism affects IPA users, particularly in personal living spaces. Emphasize the novelty of examining how these processes influence cognitive and emotional trust.\n   - Example: \"Despite the burgeoning presence of IPAs, little is known about the psychological processes by which anthropomorphism affects users, especially in personal living spaces. This study seeks to bridge this gap by exploring how anthropomorphism influences cognitive and emotional trust through task and social attraction.\"\n\n4. **Grounding the Study in Theoretical Frameworks:**\n   - Introduce relevant theoretical frameworks that underpin the study, such as theories of social presence and trust in human-computer interaction. Explain how these theories provide a foundation for understanding the mediating roles of task and social attraction.\n   - Example: \"Drawing on theories of social presence (Short, Williams, & Christie, 1976) and trust in human-computer interaction (Gefen, Karahanna, & Straub, 2003), this study examines the mediating roles of task and social attraction in the relationship between anthropomorphism and trust.\"\n\n5. **Articulating the Research Questions and Objectives:**\n   - Clearly state the research questions and objectives, focusing on how task and social attraction mediate the relationship between anthropomorphism and both cognitive and emotional trust.\n   - Example: \"This research aims to investigate how task attraction mediates the relationship between anthropomorphism and cognitive trust, and how social attraction mediates the relationship between anthropomorphism and emotional trust.\"\n\n6. **Brief Overview of the Methodology:**\n   - Provide a concise overview of the research methodology, if available, to give readers an understanding of how the study will address the research questions.\n   - Example: \"The study employs a mixed-methods approach, combining quantitative surveys with qualitative interviews to capture the nuanced interactions between users and IPAs.\"\n\n7. **Concluding with a Preview of the Study’s Contributions:**\n   - Conclude the introduction by previewing the study\\'s key contributions to theory, practice, and literature. Highlight how the findings will advance understanding of anthropomorphism in IPAs and offer practical insights for designing more effective user interfaces.\n   - Example: \"By elucidating the mediating roles of task and social attraction, this study contributes to the literature on anthropomorphism in IPAs and offers practical insights for designing interfaces that foster trust and engagement in personal living spaces.\"\n\nThis outline sets the stage for a comprehensive exploration of the mediating roles of task and social attraction in the relationship between anthropomorphism and trust, providing a robust framework for the subsequent sections of the research paper."
//     }
//  }
};