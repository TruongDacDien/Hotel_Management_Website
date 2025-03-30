// import { useState, useRef, useEffect } from "react";
// import { SendIcon, X, Bot, MessagesSquare, MapPin } from "lucide-react";
// import { Button } from "../../components/ui/button";
// import { Input } from "../../components/ui/input";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "../../components/ui/card";
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "../../components/ui/avatar";
// import { ScrollArea } from "../../components/ui/scroll-area";
// import { Badge } from "../../components/ui/badge";
// import { HOTEL_INFO } from "../../lib/constants";
// import { generateChatbotResponse } from "./ChatbotUtils";

// // Danh sách câu hỏi gợi ý
// const SAMPLE_SUGGESTIONS = [
//   "What rooms do you have?",
//   "Tell me about spa services",
//   "Nearby attractions?",
//   "Best room for family?",
//   "Restaurant recommendations",
//   "Hotel amenities",
// ];

// export default function Chatbot() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([
//     {
//       id: "1",
//       type: "bot",
//       text: `Hello! I'm the ${HOTEL_INFO.name} virtual assistant. How can I help you today?`,
//     },
//   ]);
//   const [inputValue, setInputValue] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]);

//   const handleSendMessage = (text = inputValue) => {
//     if (!text.trim()) return;

//     const userMessage = {
//       id: Date.now().toString(),
//       type: "user",
//       text: text.trim(),
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setInputValue("");
//     setIsTyping(true);

//     setTimeout(() => {
//       const botResponse = generateChatbotResponse(text.trim());
//       const botMessage = {
//         id: (Date.now() + 1).toString(),
//         type: "bot",
//         text: botResponse,
//       };

//       setMessages((prev) => [...prev, botMessage]);
//       setIsTyping(false);
//     }, 1000);
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       handleSendMessage();
//     }
//   };

//   return (
//     <>
//       {/* Nút mở chat */}
//       <Button
//         onClick={() => setIsOpen(!isOpen)}
//         className="fixed bottom-6 right-6 h-12 w-12 rounded-full p-0 shadow-lg"
//       >
//         {isOpen ? <X size={24} /> : <MessagesSquare size={24} />}
//       </Button>

//       {/* Cửa sổ chat */}
//       {isOpen && (
//         <Card className="fixed bottom-20 right-6 w-[350px] h-[500px] flex flex-col shadow-xl">
//           <CardHeader className="bg-primary text-primary-foreground">
//             <div className="flex items-center">
//               <Avatar className="h-8 w-8 mr-2">
//                 <AvatarImage src="/hotel-logo.png" alt="Hotel" />
//                 <AvatarFallback>
//                   <MapPin size={16} />
//                 </AvatarFallback>
//               </Avatar>
//               <CardTitle className="text-base">
//                 {HOTEL_INFO.name} Assistant
//               </CardTitle>
//             </div>
//           </CardHeader>
//           <CardContent className="flex-grow overflow-hidden p-0">
//             <ScrollArea className="h-[340px] p-4">
//               {messages.map((message) => (
//                 <div
//                   key={message.id}
//                   className={`mb-4 ${
//                     message.type === "user" ? "text-right" : ""
//                   }`}
//                 >
//                   <div className="flex items-start gap-2">
//                     {message.type === "bot" && (
//                       <Avatar className="h-8 w-8 mt-0.5">
//                         <AvatarFallback className="bg-primary text-primary-foreground">
//                           <Bot size={14} />
//                         </AvatarFallback>
//                       </Avatar>
//                     )}
//                     <div
//                       className={`rounded-lg p-3 inline-block max-w-[80%] ${
//                         message.type === "user"
//                           ? "bg-primary text-primary-foreground ml-auto"
//                           : "bg-muted"
//                       }`}
//                     >
//                       {message.text}
//                     </div>
//                     {message.type === "user" && (
//                       <Avatar className="h-8 w-8 mt-0.5">
//                         <AvatarFallback>U</AvatarFallback>
//                       </Avatar>
//                     )}
//                   </div>
//                 </div>
//               ))}
//               {isTyping && (
//                 <div className="mb-4">
//                   <div className="flex items-start gap-2">
//                     <Avatar className="h-8 w-8 mt-0.5">
//                       <AvatarFallback className="bg-primary text-primary-foreground">
//                         <Bot size={14} />
//                       </AvatarFallback>
//                     </Avatar>
//                     <div className="bg-muted rounded-lg p-3 inline-block">
//                       <div className="flex gap-1">
//                         <div
//                           className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
//                           style={{ animationDelay: "0ms" }}
//                         ></div>
//                         <div
//                           className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
//                           style={{ animationDelay: "150ms" }}
//                         ></div>
//                         <div
//                           className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
//                           style={{ animationDelay: "300ms" }}
//                         ></div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//               <div ref={messagesEndRef} />
//             </ScrollArea>

//             {/* Gợi ý nhanh */}
//             <div className="px-4 pb-2 flex gap-2 flex-wrap">
//               {SAMPLE_SUGGESTIONS.map((suggestion, index) => (
//                 <Badge
//                   key={index}
//                   variant="outline"
//                   className="cursor-pointer hover:bg-muted transition-colors mb-1"
//                   onClick={() => handleSendMessage(suggestion)}
//                 >
//                   {suggestion}
//                 </Badge>
//               ))}
//             </div>
//           </CardContent>
//           <CardFooter className="p-2">
//             <div className="flex w-full items-center space-x-2">
//               <Input
//                 value={inputValue}
//                 onChange={(e) => setInputValue(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 placeholder="Type your question..."
//                 className="flex-1"
//               />
//               <Button
//                 size="icon"
//                 onClick={() => handleSendMessage()}
//                 disabled={!inputValue.trim()}
//               >
//                 <SendIcon className="h-4 w-4" />
//               </Button>
//             </div>
//           </CardFooter>
//         </Card>
//       )}
//     </>
//   );
// }
