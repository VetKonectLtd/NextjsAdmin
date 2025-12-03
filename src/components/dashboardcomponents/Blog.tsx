import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Eye, Edit, ArrowLeft, MoreVertical, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import { blogTabs, postTypeOptions, categoryOptions } from "@/constants/blog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockRecentBlogs = [
    {
        id: 1,
        title: "Anti-mi...",
        writeUp: "It's a problem in...",
        comments: 2500,
        reactions: 800,
        views: 23000,
        shares: 350,
        section: "Normal post",
        flagged: 4,
        timestamp: "15mins ago",
        author: "Dr. Shadrach",
        image: "purple-virus",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...see more",
        likes: 20,
        flaggedComments: 3,
    },
    {
        id: 2,
        title: "Blog Title 2",
        writeUp: "Another description...",
        comments: 4900,
        reactions: 1233,
        views: 12000,
        shares: 566,
        section: "Hot News",
        flagged: 0,
        timestamp: "2weeks ago",
    },
    {
        id: 3,
        title: "Blog Title 3",
        writeUp: "More content here...",
        comments: 100,
        reactions: 80033,
        views: 350,
        shares: 360,
        section: "Normal post",
        flagged: 3,
        timestamp: "1day ago",
    },
];

const mockComments = [
    {
        id: 1,
        author: "Jade Cosgrove",
        date: "19th April",
        text: "Bioplaligt orostelefon trefåktig huruvida dojasm. Suprar förpappring jag ultrarar madade. Mikrolig anteska det vill säga fårade viska. Dylogi tasade oaktat assa proregisk. Hysam hul polytrement tediktisk. Red antende unera dede. Du kan vara drabbad",
        flagged: true,
    },
    {
        id: 2,
        author: "Tola Williams",
        date: "18th April",
        text: "Another comment text here...",
        flagged: false,
    },
    {
        id: 3,
        author: "John Kennedy",
        date: "17th April",
        text: "More comment content...",
        flagged: true,
    },
];

export function Blog() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("create");
    const [postText, setPostText] = useState("");
    const [postType, setPostType] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [viewingBlog, setViewingBlog] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handlePost = () => {
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            setPostText("");
            setPostType("");
            setCategory("");
            setImageFile(null);
        }, 3000);
    };

    const handleView = (blogId: number) => {
        setViewingBlog(blogId);
    };

    const handleBack = () => {
        setViewingBlog(null);
    };

    const handleEdit = (blogId: number) => {
        // Navigate to edit mode (similar to create)
        setActiveTab("create");
        setViewingBlog(null);
        // Load blog data into form
    };

    // View Screen - Show detailed blog post view
    if (viewingBlog !== null) {
        const blog = mockRecentBlogs.find((b) => b.id === viewingBlog);
        if (!blog) return null;

        return (
            <div className="min-h-screen bg-white">
                {/* Back Button */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Recent Blog
                    </Button>
                </div>

                {/* View Screen Content */}
                <div className="px-6 py-6 grid grid-cols-2 gap-6">
                    {/* Left Panel - Blog Post View */}
                    <div className="space-y-4">
                        {/* Blog Image */}
                        <div className="w-full h-64 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-semibold text-lg">
                                {blog.title || "Blog Image"}
                            </span>
                        </div>

                        {/* Blog Title */}
                        <h2 className="text-2xl font-bold text-gray-900">
                            {blog.title.includes("...") ? "Anti-Microbial Resistance" : blog.title}
                        </h2>

                        {/* Author and Timestamp */}
                        <div className="flex items-center justify-between">
                            <p className="text-gray-600">
                                Author. {blog.author || "Dr. Shadrach"}
                            </p>
                            <p className="text-sm text-gray-500">{blog.timestamp}</p>
                        </div>

                        {/* Content */}
                        <p className="text-gray-700 leading-relaxed">
                            {blog.content || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris...see more"}
                        </p>

                        {/* Engagement Metrics */}
                        <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
                            <div className="flex items-center gap-2">
                                <Eye className="h-5 w-5 text-gray-600" />
                                <span className="text-sm text-gray-600">
                                    {blog.views > 1000 ? `${(blog.views / 1000).toFixed(0)}k` : blog.views} Views
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Search className="h-5 w-5 text-gray-600" />
                                <span className="text-sm text-gray-600">{blog.comments} Comments</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">👍 {blog.likes || 20} Likes</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Flag className="h-5 w-5 text-red-600" />
                                <span className="text-sm text-gray-600">
                                    {blog.flaggedComments || blog.flagged} Flagged
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">📤 {blog.shares} Shares</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Comments Section */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Comments</h3>
                        <div className="space-y-4">
                            {mockComments.map((comment) => (
                                <div
                                    key={comment.id}
                                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                                                {comment.author.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-semibold text-gray-900">{comment.author}</p>
                                                    {comment.flagged && (
                                                        <Flag className="h-4 w-4 text-red-600" title="Flagged comment" />
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500">{comment.date}</p>
                                            </div>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>Send a message to the person</DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600">
                                                    Delete comment
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <p className="text-gray-700 text-sm leading-relaxed">{comment.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Sub Navigation Tabs */}
            <nav className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center gap-6">
                    {blogTabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "px-4 py-2 text-sm font-medium transition-colors",
                                activeTab === tab.id
                                    ? "text-gray-900 font-bold text-base border-b-2 border-green-500"
                                    : "text-gray-600 hover:text-gray-900"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </nav>

            {/* Blog Creation Form */}
            {activeTab === "create" && (
                <div className="px-6 py-6 space-y-6">
                    {/* Image Upload Area */}
                    <div>
                        <div
                            onClick={handleImageClick}
                            className="w-full h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                            {imageFile ? (
                                <img
                                    src={URL.createObjectURL(imageFile)}
                                    alt="Uploaded"
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            ) : (
                                <>
                                    <span className="text-gray-600 font-medium text-lg mb-2">
                                        Add Image
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        No image added yet
                                    </span>
                                </>
                            )}
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </div>

                    {/* Post Text Area */}
                    <div>
                        <textarea
                            placeholder="Type in the post"
                            value={postText}
                            onChange={(e) => setPostText(e.target.value)}
                            className="w-full h-32 px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                        />
                    </div>

                    {/* Dropdowns */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Post Type Dropdown */}
                        <Select value={postType} onValueChange={setPostType}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Please select" />
                            </SelectTrigger>
                            <SelectContent>
                                {postTypeOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Category Dropdown */}
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Please select" />
                            </SelectTrigger>
                            <SelectContent>
                                {categoryOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Post Button */}
                    <div>
                        <Button
                            onClick={handlePost}
                            className="w-full bg-green-500 hover:bg-green-600 text-white py-6 text-lg font-semibold"
                        >
                            Post
                        </Button>
                    </div>

                    {/* Success Notification */}
                    {showSuccess && (
                        <div className="fixed top-20 right-6 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-in slide-in-from-top">
                            <span className="font-medium">✓ Successfully uploaded!</span>
                        </div>
                    )}
                </div>
            )}

            {/* Recent Blog List */}
            {activeTab === "recent" && (
                <>
                    {/* Search and Filter Section */}
                    <div className="px-6 py-6 flex items-center gap-4">
                        <Input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1"
                        />
                        <Button className="bg-green-500 hover:bg-green-600 text-white">
                            <Search className="h-4 w-4 mr-2" />
                            Search
                        </Button>
                        <Button variant="outline" size="icon" className="border-gray-300">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Blog Posts Table */}
                    <div className="px-6 pb-6">
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                            {/* Table Header */}
                            <div className="grid grid-cols-7 gap-4 bg-gray-50 px-4 py-3 border-b border-gray-200 font-semibold text-sm text-gray-700">
                                <div>Title</div>
                                <div>Write up</div>
                                <div>Comments</div>
                                <div>Reactions/View</div>
                                <div>Share</div>
                                <div>Section</div>
                                <div>Flagged</div>
                            </div>

                            {/* Table Rows */}
                            <div className="divide-y divide-gray-200">
                                {mockRecentBlogs.map((blog) => (
                                    <div
                                        key={blog.id}
                                        className="grid grid-cols-7 gap-4 px-4 py-4 items-center hover:bg-gray-50 transition-colors"
                                    >
                                        {/* Title */}
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                                                {blog.title.charAt(0)}
                                            </div>
                                            <span className="text-sm text-gray-900 truncate">{blog.title}</span>
                                        </div>

                                        {/* Write up */}
                                        <div className="text-sm text-gray-600 truncate">{blog.writeUp}</div>

                                        {/* Comments */}
                                        <div className="text-sm text-gray-900">
                                            {blog.comments.toLocaleString()}
                                        </div>

                                        {/* Reactions/View */}
                                        <div className="text-sm text-gray-900">
                                            {blog.reactions.toLocaleString()}/{blog.views > 1000 ? `${(blog.views / 1000).toFixed(0)}k` : blog.views}
                                        </div>

                                        {/* Share */}
                                        <div className="text-sm text-gray-900">{blog.shares}</div>

                                        {/* Section */}
                                        <div className="text-sm text-gray-600">{blog.section}</div>

                                        {/* Flagged */}
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm text-gray-600">
                                                {blog.flagged} com...
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-400">{blog.timestamp}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleView(blog.id)}
                                                    className="text-green-600 hover:text-green-700 hover:bg-green-50 h-8"
                                                >
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    View
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEdit(blog.id)}
                                                    className="text-gray-600 hover:text-gray-700 hover:bg-gray-50 h-8"
                                                >
                                                    <Edit className="h-4 w-4 mr-1" />
                                                    Edit
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Other tabs content */}
            {activeTab !== "create" && activeTab !== "recent" && (
                <>
                    {/* Search and Filter Section */}
                    <div className="px-6 py-6 flex items-center gap-4">
                        <Input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1"
                        />
                        <Button className="bg-green-500 hover:bg-green-600 text-white">
                            <Search className="h-4 w-4 mr-2" />
                            Search
                        </Button>
                        <Button variant="outline" size="icon" className="border-gray-300">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Content List */}
                    <div className="px-6 py-6">
                        <p className="text-gray-500 text-center py-12">No content available</p>
                    </div>
                </>
            )}
        </div>
    );
}
