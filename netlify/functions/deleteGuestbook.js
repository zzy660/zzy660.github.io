const supabase = require('./supabase');

exports.handler = async (event, context) => {
  // 允许跨域请求
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { id, ip } = JSON.parse(event.body);
    
    if (!id || !ip) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'ID and IP are required' })
      };
    }

    // 首先检查这条留言是否存在且IP匹配
    const { data: message, error: fetchError } = await supabase
      .from('guestbook')
      .select('ip')
      .eq('id', id)
      .single();

    if (fetchError || !message) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: '留言不存在' })
      };
    }

    // 检查IP是否匹配（只允许删除自己的留言）
    if (message.ip !== ip) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ error: '无权限删除此留言' })
      };
    }

    // 从Supabase删除留言
    const { error: deleteError } = await supabase
      .from('guestbook')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Supabase删除错误:', deleteError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: '数据库删除失败' })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: '留言删除成功'
      })
    };
  } catch (error) {
    console.error('Error deleting guestbook entry:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: '服务器内部错误' })
    };
  }
};