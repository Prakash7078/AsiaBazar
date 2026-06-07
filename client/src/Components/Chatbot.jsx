import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Bot, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getCafeItems, getProducts, getStoreItems } from "../redux/productSlice";
import { smartFilterProducts } from "../utils/smartProductSearch";

const QUICK_PROMPTS = [
  "Do you have drinks?",
  "Show spicy snacks",
  "Cafe hours?",
  "How does pickup work?",
];

const normalize = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9.\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getProductPrice = (product) => {
  const price = Number(product?.product_price || 0);
  const discount = Number(product?.discount || 0);
  return discount > 0 ? (price - (price * discount) / 100).toFixed(2) : price.toFixed(2);
};

const getSection = (product) =>
  product?.product_category?.toLowerCase() === "cafe" ? "Café" : "Store";

const Chatbot = () => {
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi! I’m Ask Asia Bazaar. I can help with store products, café items, pickup, delivery, payments, hours, and contact details.",
    },
  ]);

  const { products, storeItems, cafeItems } = useSelector((state) => state.product);
  const catalog = useMemo(() => {
    const merged = [...(products || []), ...(storeItems || []), ...(cafeItems || [])];
    return [...new Map(merged.map((product) => [product?._id, product])).values()];
  }, [cafeItems, products, storeItems]);

  useEffect(() => {
    if (catalog.length === 0) {
      dispatch(getProducts());
      dispatch(getStoreItems());
      dispatch(getCafeItems());
    }
  }, [catalog.length, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const buildProductResponse = (query) => {
    const normalizedQuery = normalize(query);
    const wantsCafe = /\b(cafe|café|food|meal|drink|drinks|chat|chaat|biryani|appetizer|dessert)\b/.test(normalizedQuery);
    const wantsStore = /\b(store|grocery|groceries|vegetable|rice|snack|snacks|meat|fish|mutton|fruit)\b/.test(normalizedQuery);
    const source = wantsCafe && !wantsStore
      ? cafeItems
      : wantsStore && !wantsCafe
        ? storeItems
        : catalog;

    const matches = smartFilterProducts(source || [], {
      query,
      onlyInStock: /\b(in stock|available)\b/.test(normalizedQuery),
      onlyDiscount: /\b(deal|discount|sale|offer)\b/.test(normalizedQuery),
    }).slice(0, 5);

    if (matches.length === 0) {
      return {
        text: "I couldn’t find an exact match. Try asking for a category like drinks, snacks, rice, meat, desserts, or spicy items.",
        products: [],
      };
    }

    return {
      text: `I found ${matches.length} matching ${matches.length === 1 ? "item" : "items"}.`,
      products: matches,
    };
  };

  const getBotResponse = (question) => {
    const query = normalize(question);

    if (/\b(hour|hours|open|timing|time)\b/.test(query)) {
      return {
        text: "Café hours shown on the site are 4:00 PM – 9:30 PM on Friday, Saturday, Sunday, and Monday. Store availability can be checked through the product catalog.",
        products: [],
      };
    }

    if (/\b(phone|call|contact|number|address|location)\b/.test(query)) {
      return {
        text: "You can contact Asia Bazaar at +1 (316) 612-2700. Product pages also show the phone number for quick enquiries.",
        products: [],
      };
    }

    if (/\b(pickup|pick up|collect)\b/.test(query)) {
      return {
        text: "Pickup is supported during checkout. Choose PICKUP, place the order, and share your full name at the counter so staff can find your order.",
        products: [],
      };
    }

    if (/\b(delivery|deliver|shipping|ship)\b/.test(query)) {
      return {
        text: "Delivery is supported during checkout. The site asks for your address and applies delivery/tax charges before placing the order.",
        products: [],
      };
    }

    if (/\b(payment|pay|stripe|card|cash)\b/.test(query)) {
      return {
        text: "The website supports card payments through Stripe, cash on delivery, and pay-on-pickup depending on your checkout selection.",
        products: [],
      };
    }

    if (/\b(return|refund|cancel)\b/.test(query)) {
      return {
        text: "For returns, refunds, or cancellations, please contact the store directly at +1 (316) 612-2700 so the team can check your order.",
        products: [],
      };
    }

    return buildProductResponse(question);
  };

  const sendMessage = (text = input) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const response = getBotResponse(trimmed);
    setMessages((current) => [
      ...current,
      { role: "user", text: trimmed },
      { role: "bot", ...response },
    ]);
    setInput("");
    setIsOpen(true);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-3 sm:right-6 z-[60] w-[calc(100vw-1.5rem)] max-w-md overflow-hidden rounded-3xl border border-green-100 bg-white shadow-2xl">
          <div className="bg-gradient-to-r from-green-700 to-emerald-500 px-4 py-4 text-white">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Bot size={22} />
                </div>
                <div>
                  <p className="font-bold leading-tight">Ask Asia Bazaar</p>
                  <p className="text-xs text-green-50">Product & website enquiry bot</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 hover:bg-white/20"
                aria-label="Close chatbot"
              >
                <X size={19} />
              </button>
            </div>
          </div>

          <div className="h-80 overflow-y-auto bg-gray-50 px-3 py-4 space-y-3">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                    message.role === "user"
                      ? "bg-green-600 text-white"
                      : "bg-white text-gray-800 border border-gray-100"
                  }`}
                >
                  <p>{message.text}</p>
                  {message.products?.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.products.map((product) => (
                        <Link
                          key={product?._id}
                          to={`/product/${product?._id}`}
                          onClick={() => setIsOpen(false)}
                          className="block rounded-xl border border-green-100 bg-green-50 p-2 hover:bg-green-100"
                        >
                          <div className="flex gap-2">
                            <img
                              src={product?.product_image?.[0]}
                              alt={product?.product_name}
                              className="h-12 w-12 rounded-lg object-cover bg-white"
                            />
                            <div className="min-w-0">
                              <p className="truncate font-bold text-gray-900">
                                {product?.product_name?.split("#")?.[0]}
                              </p>
                              <p className="text-xs text-gray-600">
                                {getSection(product)} • ${getProductPrice(product)}
                              </p>
                              <p className="text-xs font-semibold text-green-700">
                                {product?.outOfStock ? "Out of stock" : "Available"}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-green-100 bg-white/95 p-3">
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="whitespace-nowrap rounded-full border border-green-100 bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700 hover:bg-green-100"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                sendMessage();
              }}
              className="flex w-full items-center gap-2"
            >
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about products, café, pickup..."
                className="min-w-0 flex-1 rounded-2xl border border-green-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 shadow-inner placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-100"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-green-600 text-white shadow-md shadow-green-100 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen((current) => !current)}
        className="fixed bottom-5 right-4 sm:right-6 z-[60] inline-flex items-center gap-2 rounded-full bg-green-600 px-4 py-3 font-bold text-white shadow-xl shadow-green-200 hover:bg-green-700"
        aria-label="Open Asia Bazaar chatbot"
      >
        {isOpen ? <X size={20} /> : <MessageCircle size={20} />}
        <span className="hidden sm:inline">{isOpen ? "Close" : "Ask Asia Bazaar"}</span>
        {!isOpen && <Sparkles size={16} className="hidden sm:block text-yellow-200" />}
      </button>
    </>
  );
};

export default Chatbot;
