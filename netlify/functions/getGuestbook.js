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

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // 从Supabase获取留言数据
    const { data, error } = await supabase
      .from('guestbook')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Supabase查询错误:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: '数据库查询失败' })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data || [])
    };
  } catch (error) {
    console.error('Error reading guestbook:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: '服务器内部错误' })
    };
  }
};