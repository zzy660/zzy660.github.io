const { createClient } = require('@supabase/supabase-js');

// Supabase配置（本地硬编码）
const supabaseUrl = 'https://gwjpldhjelwyslnlydvk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3anBsZGhqZWx3eXNsbmx5ZHZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3MDQzMzYsImV4cCI6MjA2OTI4MDMzNn0.xFHXRTf5SxkS9QwIzl-iKHgG8QdNURY993Vlupq8RS8';

// 创建Supabase客户端
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;