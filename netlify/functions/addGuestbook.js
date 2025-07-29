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
    const { name, content, ip } = JSON.parse(event.body);
    
    if (!name || !content) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Name and content are required' })
      };
    }

    // 检查是否已存在该IP的留言
    const { data: existingMessages } = await supabase
      .from('guestbook')
      .select('ip')
      .eq('ip', ip || 'anonymous');

    if (existingMessages && existingMessages.length > 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: '每个人只能留言一次！您可以删除之前的留言后重新留言。' })
      };
    }

    // 添加新留言到Supabase
    const newEntry = {
      name: name.trim(),
      content: content.trim(),
      ip: ip || 'anonymous',
      timestamp: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('guestbook')
      .insert([newEntry])
      .select();

    if (error) {
      console.error('Supabase插入错误:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: '数据库写入失败' })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: '留言添加成功',
        data: data[0]
      })
    };
  } catch (error) {
    console.error('Error adding guestbook entry:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: '服务器内部错误' })
    };
  }
};