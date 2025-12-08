import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Eye, Edit, ArrowLeft, MoreVertical, Flag, Loader2 } from "lucide-react";
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
import { useBlogStore } from "@/stores/use-blog-store";
import type { Blog, BlogFlagType } from "@/types/blog";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

export function BlogComponent() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("create");
    const [postTitle, setPostTitle] = useState("");
    const [postText, setPostText] = useState("");
    const [postType, setPostType] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [viewingBlog, setViewingBlog] = useState<Blog | null>(null);
    const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Confirmation modal state
    const [confirmationModal, setConfirmationModal] = useState<{
        isOpen: boolean;
        title: string;
        description: string;
        action: () => Promise<void>;
        isLoading: boolean;
        variant?: "danger" | "warning" | "info";
        confirmLabel?: string;
    }>({
        isOpen: false,
        title: "",
        description: "",
        action: async () => {},
        isLoading: false,
        variant: "danger"
    });

    // Store
    const {
        blogs,
        deletedBlogs,
        isLoading,
        fetchBlogs,
        fetchDeletedBlogs,
        createBlog,
        updateBlog,
        deleteBlog,
        restoreBlog,
        publishBlog,
        archiveBlog,
        rejectBlog,
        flagBlog
    } = useBlogStore();

    // Fetch blogs on mount and tab change
    useEffect(() => {
        if (activeTab === "recent" || activeTab === "create") {
            fetchBlogs();
        } else if (activeTab === "deleted") {
            fetchDeletedBlogs();
        }
    }, [activeTab, fetchBlogs, fetchDeletedBlogs]);

    // Filter blogs based on search
    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handlePost = async () => {
        if (!postTitle.trim() || !postText.trim() || !postType || !category) {
            return;
        }
        
        try {
            if (editingBlog) {
                await updateBlog(editingBlog.id, {
                    title: postTitle,
                    content: postText,
                    category: category,
                    section: postType as 'hot news' | 'normal post',
                    picture: imageFile
                });
                setEditingBlog(null);
            } else {
                await createBlog({
                    title: postTitle,
                    content: postText,
                    category: category,
                    section: postType as 'hot news' | 'normal post',
                    picture: imageFile
                });
            }
            // Reset form
            setPostTitle("");
            setPostText("");
            setPostType("");
            setCategory("");
            setImageFile(null);
            setActiveTab("recent");
        } catch {
            // Error handled by store
        }
    };

    const handleView = (blog: Blog) => {
        setViewingBlog(blog);
    };

    const handleBack = () => {
        setViewingBlog(null);
    };

    const handleEdit = (blog: Blog) => {
        setEditingBlog(blog);
        setPostTitle(blog.title);
        setPostText(blog.content);
        setPostType(blog.section);
        setCategory(blog.category);
        setActiveTab("create");
        setViewingBlog(null);
    };

    const handleDelete = (blog: Blog) => {
        setConfirmationModal({
            isOpen: true,
            title: "Delete Blog",
            description: `Are you sure you want to delete "${blog.title}"? This action can be undone from the deleted blogs section.`,
            confirmLabel: "Delete",
            variant: "danger",
            isLoading: false,
            action: async () => {
                setConfirmationModal(prev => ({ ...prev, isLoading: true }));
                try {
                    await deleteBlog(blog.id);
                    setConfirmationModal(prev => ({ ...prev, isOpen: false, isLoading: false }));
                } catch {
                    setConfirmationModal(prev => ({ ...prev, isLoading: false }));
                }
            }
        });
    };

    const handleStatusAction = (blog: Blog, action: 'publish' | 'archive' | 'reject') => {
        const actionLabels = {
            publish: { title: "Publish Blog", description: "This will make the blog visible to users.", label: "Publish", variant: "info" as const },
            archive: { title: "Archive Blog", description: "This will hide the blog from users.", label: "Archive", variant: "warning" as const },
            reject: { title: "Reject Blog", description: "This will reject the blog submission.", label: "Reject", variant: "danger" as const }
        };
        
        const config = actionLabels[action];
        
        setConfirmationModal({
            isOpen: true,
            title: config.title,
            description: config.description,
            confirmLabel: config.label,
            variant: config.variant,
            isLoading: false,
            action: async () => {
                setConfirmationModal(prev => ({ ...prev, isLoading: true }));
                try {
                    if (action === 'publish') await publishBlog(blog.id);
                    else if (action === 'archive') await archiveBlog(blog.id);
                    else if (action === 'reject') await rejectBlog(blog.id);
                    setConfirmationModal(prev => ({ ...prev, isOpen: false, isLoading: false }));
                } catch {
                    setConfirmationModal(prev => ({ ...prev, isLoading: false }));
                }
            }
        });
    };

    const handleFlag = async (blog: Blog, flag: BlogFlagType) => {
        await flagBlog(blog.id, flag);
    };

    const handleRestore = (blog: Blog) => {
        setConfirmationModal({
            isOpen: true,
            title: "Restore Blog",
            description: `Restore "${blog.title}" from deleted blogs?`,
            confirmLabel: "Restore",
            variant: "info",
            isLoading: false,
            action: async () => {
                setConfirmationModal(prev => ({ ...prev, isLoading: true }));
                try {
                    await restoreBlog(blog.id);
                    setConfirmationModal(prev => ({ ...prev, isOpen: false, isLoading: false }));
                } catch {
                    setConfirmationModal(prev => ({ ...prev, isLoading: false }));
                }
            }
        });
    };

    const closeConfirmation = () => {
        if (!confirmationModal.isLoading) {
            setConfirmationModal(prev => ({ ...prev, isOpen: false }));
        }
    };

    // View Screen - Show detailed blog post view
    if (viewingBlog !== null) {
        return (
            <div className="min-h-screen bg-white">
                {/* Back Button */}
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        className="text-gray-600 hover:text-gray-900 text-sm sm:text-base"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Recent Blog
                    </Button>
                </div>

                {/* View Screen Content */}
                <div className="px-4 sm:px-6 py-4 sm:py-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {/* Left Panel - Blog Post View */}
                    <div className="space-y-3 sm:space-y-4">
                        {/* Blog Image */}
                        {viewingBlog.picture_url ? (
                            <img 
                                src={viewingBlog.picture_url} 
                                alt={viewingBlog.title} 
                                className="w-full h-64 object-cover rounded-lg"
                            />
                        ) : (
                            <div className="w-full h-64 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-semibold text-lg">
                                    {viewingBlog.title}
                                </span>
                            </div>
                        )}

                        {/* Blog Title */}
                        <h2 className="text-2xl font-bold text-gray-900">
                            {viewingBlog.title}
                        </h2>

                        {/* Author and Timestamp */}
                        <div className="flex items-center justify-between">
                            <p className="text-gray-600">
                                Author. {viewingBlog.author?.name || "Unknown"}
                            </p>
                            <p className="text-sm text-gray-500">
                                {new Date(viewingBlog.created_at).toLocaleDateString()}
                            </p>
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center gap-2">
                            <span className={cn(
                                "px-3 py-1 rounded-full text-xs font-medium border capitalize",
                                viewingBlog.status === 'published' && "text-green-600 bg-green-50 border-green-200",
                                viewingBlog.status === 'draft' && "text-yellow-600 bg-yellow-50 border-yellow-200",
                                viewingBlog.status === 'archived' && "text-gray-600 bg-gray-50 border-gray-200",
                                viewingBlog.status === 'rejected' && "text-red-600 bg-red-50 border-red-200"
                            )}>
                                {viewingBlog.status}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-medium border text-blue-600 bg-blue-50 border-blue-200 capitalize">
                                {viewingBlog.section}
                            </span>
                        </div>

                        {/* Content */}
                        <p className="text-gray-700 leading-relaxed">
                            {viewingBlog.content}
                        </p>

                        {/* Engagement Metrics */}
                        <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
                            <div className="flex items-center gap-2">
                                <Eye className="h-5 w-5 text-gray-600" />
                                <span className="text-sm text-gray-600">
                                    {parseInt(viewingBlog.views_count).toLocaleString()} Views
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">💬 {viewingBlog.comments_count} Comments</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">👍 {viewingBlog.likes_count} Likes</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">📤 {viewingBlog.shares_count} Shares</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 pt-4">
                            <Button
                                variant="outline"
                                onClick={() => handleEdit(viewingBlog)}
                                className="text-gray-600"
                            >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </Button>
                            {viewingBlog.status === 'draft' && (
                                <Button
                                    onClick={() => handleStatusAction(viewingBlog, 'publish')}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    Publish
                                </Button>
                            )}
                            {viewingBlog.status === 'published' && (
                                <Button
                                    variant="outline"
                                    onClick={() => handleStatusAction(viewingBlog, 'archive')}
                                    className="text-orange-600 border-orange-200"
                                >
                                    Archive
                                </Button>
                            )}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="icon">
                                        <Flag className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => handleFlag(viewingBlog, 'none')}>
                                        Clear Flag
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleFlag(viewingBlog, 'spam')}>
                                        Flag as Spam
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleFlag(viewingBlog, 'abuse')}>
                                        Flag as Abuse
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleFlag(viewingBlog, 'hidden')}>
                                        Hide
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* Right Panel - Comments Section */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Comments</h3>
                        <div className="space-y-4">
                            {viewingBlog.comments.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No comments yet</p>
                            ) : (
                                viewingBlog.comments.map((comment) => (
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
                                                            <Flag className="h-4 w-4 text-red-600" />
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
                                                        Flag comment
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        <p className="text-gray-700 text-sm leading-relaxed">{comment.text}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <ConfirmationModal
                    isOpen={confirmationModal.isOpen}
                    onClose={closeConfirmation}
                    onConfirm={confirmationModal.action}
                    title={confirmationModal.title}
                    description={confirmationModal.description}
                    confirmLabel={confirmationModal.confirmLabel}
                    variant={confirmationModal.variant}
                    isLoading={confirmationModal.isLoading}
                />
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
                    {/* Title Input */}
                    <div>
                        <Input
                            placeholder="Blog Title"
                            value={postTitle}
                            onChange={(e) => setPostTitle(e.target.value)}
                            className="text-lg font-semibold"
                        />
                    </div>

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
                            placeholder="Type in the post content"
                            value={postText}
                            onChange={(e) => setPostText(e.target.value)}
                            className="w-full h-32 px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                        />
                    </div>

                    {/* Dropdowns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {/* Post Type Dropdown */}
                        <Select value={postType} onValueChange={setPostType}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Section (Hot News / Normal Post)" />
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
                                <SelectValue placeholder="Category" />
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
                            disabled={isLoading || !postTitle.trim() || !postText.trim() || !postType || !category}
                            className="w-full bg-green-500 hover:bg-green-600 text-white py-6 text-lg font-semibold"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                    {editingBlog ? "Updating..." : "Posting..."}
                                </>
                            ) : (
                                editingBlog ? "Update Post" : "Post"
                            )}
                        </Button>
                    </div>
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
                        {isLoading ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-green-500" />
                            </div>
                        ) : filteredBlogs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                                <p>No blogs found</p>
                            </div>
                        ) : (
                            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                {/* Table Header */}
                                <div className="grid grid-cols-7 gap-4 bg-gray-50 px-4 py-3 border-b border-gray-200 font-semibold text-sm text-gray-700">
                                    <div>Title</div>
                                    <div>Content</div>
                                    <div>Status</div>
                                    <div>Views</div>
                                    <div>Comments</div>
                                    <div>Section</div>
                                    <div>Actions</div>
                                </div>

                                {/* Table Rows */}
                                <div className="divide-y divide-gray-200">
                                    {filteredBlogs.map((blog) => (
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

                                            {/* Content */}
                                            <div className="text-sm text-gray-600 truncate">{blog.content.substring(0, 30)}...</div>

                                            {/* Status */}
                                            <div>
                                                <span className={cn(
                                                    "px-2 py-1 rounded-full text-xs font-medium capitalize",
                                                    blog.status === 'published' && "text-green-600 bg-green-50",
                                                    blog.status === 'draft' && "text-yellow-600 bg-yellow-50",
                                                    blog.status === 'archived' && "text-gray-600 bg-gray-50",
                                                    blog.status === 'rejected' && "text-red-600 bg-red-50"
                                                )}>
                                                    {blog.status}
                                                </span>
                                            </div>

                                            {/* Views */}
                                            <div className="text-sm text-gray-900">
                                                {parseInt(blog.views_count).toLocaleString()}
                                            </div>

                                            {/* Comments */}
                                            <div className="text-sm text-gray-900">{blog.comments_count}</div>

                                            {/* Section */}
                                            <div className="text-sm text-gray-600 capitalize">{blog.section}</div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleView(blog)}
                                                    className="text-green-600 hover:text-green-700 hover:bg-green-50 h-8"
                                                >
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    View
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEdit(blog)}
                                                    className="text-gray-600 hover:text-gray-700 hover:bg-gray-50 h-8"
                                                >
                                                    <Edit className="h-4 w-4 mr-1" />
                                                    Edit
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        {blog.status === 'draft' && (
                                                            <DropdownMenuItem onClick={() => handleStatusAction(blog, 'publish')}>
                                                                Publish
                                                            </DropdownMenuItem>
                                                        )}
                                                        {blog.status === 'published' && (
                                                            <DropdownMenuItem onClick={() => handleStatusAction(blog, 'archive')}>
                                                                Archive
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuItem onClick={() => handleStatusAction(blog, 'reject')} className="text-red-600">
                                                            Reject
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDelete(blog)} className="text-red-600">
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Deleted Blogs Tab */}
            {activeTab === "deleted" && (
                <div className="px-6 py-6">
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-green-500" />
                        </div>
                    ) : deletedBlogs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                            <p>No deleted blogs</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {deletedBlogs.map((blog) => (
                                <div key={blog.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{blog.title}</h4>
                                        <p className="text-sm text-gray-500">Deleted on {new Date(blog.deleted_at || '').toLocaleDateString()}</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        onClick={() => handleRestore(blog)}
                                        className="text-green-600 border-green-200"
                                    >
                                        Restore
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Other tabs content */}
            {activeTab !== "create" && activeTab !== "recent" && activeTab !== "deleted" && (
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

            <ConfirmationModal
                isOpen={confirmationModal.isOpen}
                onClose={closeConfirmation}
                onConfirm={confirmationModal.action}
                title={confirmationModal.title}
                description={confirmationModal.description}
                confirmLabel={confirmationModal.confirmLabel}
                variant={confirmationModal.variant}
                isLoading={confirmationModal.isLoading}
            />
        </div>
    );
}

// Keep the old export name for backwards compatibility
export { BlogComponent as Blog };
