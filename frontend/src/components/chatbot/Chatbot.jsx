import { useState, useRef, useEffect } from "react";
import { SendIcon, X, Bot, MessagesSquare, MapPin } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Badge } from "../../components/ui/badge";
import { HOTEL_INFO } from "../../lib/constants";
import { useAuth } from "../../hooks/use-auth";
import defaultChatbot from "../../assets/Chatbot.jpg";
import defaultAvatar from "../../assets/avatar-default.svg";
import { getCustomerAccountById } from "../../config/api";
// Danh sách câu hỏi gợi ý
const SAMPLE_SUGGESTIONS = [
  "Các phòng còn trống?",
  "Giá phòng hiện tại?",
  "Các địa điểm xung quanh?",
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth(); // Lấy thông tin người dùng từ hook auth
  const [userInfor, setUserInfor] = useState(null);
  console.log(user);

  const fetchUser = async () => {
    if (!user || !user.id) return;
    try {
      const res = await getCustomerAccountById(user.id);

      console.log(res);

      setUserInfor(res);
    } catch (err) {
      console.error("Failed to fetch user");
    }
  };
  useEffect(() => {
    fetchUser();
  }, [user]);
  console.log(userInfor);

  const [messages, setMessages] = useState([
    {
      id: "1",
      type: "bot",
      text: `Hello! I'm the ${HOTEL_INFO.name} virtual assistant. How can I help you today?`,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Xử lý gửi tin nhắn: chỉ hiển thị UI, phần trả lời bot sẽ xử lý sau
  const handleSendMessage = (text = inputValue) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: "user",
      text: text.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // TODO: Gửi text lên backend để lấy câu trả lời phù hợp (phòng trống, địa điểm du lịch, ...)
    // fetch('/api/chatbot/ask', { method: 'POST', body: JSON.stringify({ message: text }) })
    //   .then(res => res.json())
    //   .then(data => {
    //     setMessages((prev) => [...prev, { id: Date.now() + 1 + '', type: 'bot', text: data.reply }]);
    //     setIsTyping(false);
    //   });
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: "bot",
          text: "(Bot sẽ trả lời ở đây - tích hợp backend sau)",
        },
      ]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Nút mở chat */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full p-0 shadow-lg z-50 bg-white text-black hover:bg-gray-100"
      >
        {isOpen ? <X size={24} /> : <MessagesSquare size={24} />}
      </Button>

      {/* Khung chat */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50">
          <div className="w-[350px] h-[500px] bg-white border border-gray-200 rounded-xl shadow-xl flex flex-col overflow-hidden">
            {/* Header */}
            <CardHeader className="bg-primary text-primary-foreground rounded-t-xl">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="/hotel-logo.png" alt="Hotel" />
                  <AvatarFallback>
                    <MapPin size={16} />
                  </AvatarFallback>
                </Avatar>
                <div className="text-base font-semibold">
                  {HOTEL_INFO.name} Assistant
                </div>
              </div>
            </CardHeader>

            {/* Nội dung & gợi ý + input */}
            <CardContent className="flex-grow flex flex-col p-0 overflow-hidden">
              {/* Vùng tin nhắn cuộn được */}
              <ScrollArea className="flex-1 px-4 py-2 overflow-y-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-4 flex items-end ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.type === "bot" && (
                      <>
                        <Avatar className="h-8 w-8 ml-2">
                          <AvatarImage src={defaultChatbot} alt="User" />
                        </Avatar>
                        <div className="rounded-xl px-4 py-2 max-w-[80%] text-sm bg-gray-100 text-gray-800">
                          {message.text}
                        </div>
                      </>
                    )}
                    {message.type === "user" && (
                      <>
                        <div className="flex items-end justify-end gap-2">
                          <div className="rounded-xl px-4 py-2 max-w-[80%] text-sm bg-gray-400 text-white">
                            {message.text}
                          </div>
                          <Avatar className="h-8 w-8 ml-2">
                            <AvatarImage
                              src={userInfor.AvatarURL || defaultAvatar}
                              alt="User"
                            />
                            {/* <AvatarFallback>
                              {userInfor.name?.charAt(0).toUpperCase() || "U"}
                            </AvatarFallback> */}
                          </Avatar>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div className="mb-4 flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-white">
                        <Bot size={14} />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-200 rounded-lg px-3 py-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <div
                          className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </ScrollArea>

              {/* Gợi ý + Input */}
              <div className="border-t border-gray-100 bg-gray-50">
                {/* Gợi ý nhanh */}
                <div className="px-4 pt-2 pb-1 flex gap-2 flex-wrap">
                  {SAMPLE_SUGGESTIONS.map((suggestion, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-muted text-sm"
                      onClick={() => handleSendMessage(suggestion)}
                    >
                      {suggestion}
                    </Badge>
                  ))}
                </div>

                {/* Ô nhập tin nhắn */}
                <div className="px-4 pb-3 pt-1">
                  <div className="flex w-full items-center space-x-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your question..."
                      className="flex-1 rounded-full px-4 py-2 text-sm"
                    />
                    <Button
                      size="icon"
                      className="rounded-full"
                      onClick={() => handleSendMessage()}
                      disabled={!inputValue.trim()}
                    >
                      <SendIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        </div>
      )}
    </>
  );
}
