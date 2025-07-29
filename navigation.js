const sidebarLinks = document.querySelectorAll('.sidebar a');
		const contentLinks = document.querySelectorAll('.content a[href^="#"]');
		const sections = document.querySelectorAll('.content-section');
		function showSection(targetId) {
			sections.forEach(section => {
				section.style.display = 'none';
			});
			const targetSection = document.getElementById(targetId);
			if (targetSection) {
				targetSection.style.display = 'block';
			}
		}
		
		// 处理侧边栏链接点击事件
		sidebarLinks.forEach(link => {
			link.addEventListener('click', function(event) {
				const href = this.getAttribute('href');
				// 如果是页面内锚点，阻止默认行为并切换内容
				if (href && href.startsWith('#')) {
					event.preventDefault();
					const targetId = href.substring(1);
					showSection(targetId);
				}
				// 如果是外部链接，允许正常跳转
			});
		});
		
		// 处理内容区域内的页面内链接点击事件
		contentLinks.forEach(link => {
			link.addEventListener('click', function(event) {
				event.preventDefault();
				const targetId = this.getAttribute('href').substring(1);
				showSection(targetId);
			});
		});
		const homeButton = document.querySelector('.home-button');
		if (homeButton) {
			homeButton.addEventListener('click', function(event) {
				event.preventDefault(); 
				if (sections.length > 0) {
					showSection(sections[0].id);
				}
			});
		}

		// 页面加载完成后执行
		window.addEventListener('DOMContentLoaded', function() {
			const navbar = document.querySelector('.navbar');
			const links = document.querySelector('.navbar .links');
			const sidebar = document.querySelector('.sidebar');

			// 获取已存在的菜单切换按钮
		const menuToggle = document.querySelector('.mobile-menu-toggle');

			// 全局侧边栏切换函数
			window.toggleSidebar = function() {
				const sidebar = document.querySelector('.sidebar');
				sidebar.classList.toggle('active');
				
				// 移动端显示/隐藏侧边栏
				if (window.innerWidth <= 768) {
					if (sidebar.classList.contains('active')) {
						sidebar.style.display = 'block';
						sidebar.style.transform = 'translateX(0)';
					} else {
						sidebar.style.display = 'none';
						sidebar.style.transform = 'translateX(-100%)';
					}
				}
			};

			window.closeSidebar = function() {
				const sidebar = document.querySelector('.sidebar');
				sidebar.classList.remove('active');
				
				// 移动端隐藏侧边栏
				if (window.innerWidth <= 768) {
					sidebar.style.display = 'none';
					sidebar.style.transform = 'translateX(-100%)';
				}
			};

			// 绑定菜单切换按钮事件
			if (menuToggle) {
				menuToggle.addEventListener('click', function(event) {
					event.stopPropagation();
					window.toggleSidebar();
				});
			}

			// 页面加载时根据屏幕宽度处理显示
			function handleResponsiveLayout() {
				const sidebar = document.querySelector('.sidebar');
				
				if (window.innerWidth <= 768) {
					// 移动端模式
					links.style.display = 'none';
					if (menuToggle) menuToggle.style.display = 'block';
					
					// 确保侧边栏初始隐藏
					if (!sidebar.classList.contains('active')) {
						sidebar.style.display = 'none';
						sidebar.style.transform = 'translateX(-100%)';
					}
				} else {
					// 桌面端模式
					links.style.display = 'flex';
					if (menuToggle) menuToggle.style.display = 'none';
					
					// 确保侧边栏显示
					sidebar.style.display = 'block';
					sidebar.style.transform = 'none';
					sidebar.classList.remove('active');
				}
			}

			// 初始调用
			handleResponsiveLayout();

			// 窗口大小改变时的处理
			window.addEventListener('resize', handleResponsiveLayout);

			// 点击页面其他地方关闭侧边栏（移动端）
			document.addEventListener('click', function(event) {
				const sidebar = document.querySelector('.sidebar');
				const menuToggle = document.querySelector('.mobile-menu-toggle');
				
				if (window.innerWidth <= 768) {
					if (!sidebar.contains(event.target) && 
						!menuToggle.contains(event.target) && 
						sidebar.classList.contains('active')) {
						window.closeSidebar();
					}
				}
			});

			// 侧边栏链接点击事件（确保内容切换）
			sidebar.querySelectorAll('a').forEach(link => {
				link.addEventListener('click', function(event) {
					const href = this.getAttribute('href');
					if (href && href.startsWith('#')) {
						event.preventDefault();
						const targetId = href.substring(1);
						showSection(targetId);
						
						// 移动端点击后自动关闭侧边栏
						if (window.innerWidth <= 768) {
							window.closeSidebar();
						}
					}
					// 外部链接允许正常跳转，不阻止默认行为
				});
			});
		
		// 指令搜索功能
		const searchInput = document.getElementById('commandSearch');
		const searchResults = document.getElementById('searchResults');
		const contentSection = document.getElementById('section5');

		// 获取所有指令项
		function getCommandItems() {
			const items = [];
			const elements = contentSection.querySelectorAll('h3, h4, p, ul, li');
			let currentCategory = '';
			let currentSubCategory = '';

			elements.forEach(element => {
				if (element.tagName === 'H3') {
					currentCategory = element.textContent;
					currentSubCategory = '';
				} else if (element.tagName === 'H4') {
					currentSubCategory = element.textContent;
				} else if ((element.tagName === 'P' || element.tagName === 'UL' || element.tagName === 'LI') && element.textContent.trim() !== '') {
					items.push({
						category: currentCategory,
						subcategory: currentSubCategory,
						text: element.textContent,
						element: element
					});
				}
			});

			return items;
		}

		// 搜索功能（只定位不隐藏内容）
		function searchCommands() {
			console.log('常用指令搜索按钮被点击，开始搜索...');
			const searchTerm = searchInput.value.toLowerCase();
			console.log('搜索关键词:', searchTerm);
			
			if (searchTerm === '') {
				searchResults.innerHTML = '';
				// 移除所有高亮
				const highlightedElements = contentSection.querySelectorAll('.highlight');
				highlightedElements.forEach(el => {
					el.classList.remove('highlight');
				});
				console.log('搜索词为空，返回');
				return;
			}

			const elements = contentSection.querySelectorAll('h3, h4, p, ul, li');
			console.log('搜索元素数量:', elements.length);
			let matchCount = 0;
			let firstMatch = null;

			// 移除之前的高亮
			const highlightedElements = contentSection.querySelectorAll('.highlight');
			highlightedElements.forEach(el => {
				el.classList.remove('highlight');
			});

			elements.forEach(element => {
				if (element.textContent.toLowerCase().includes(searchTerm)) {
					element.classList.add('highlight');
					matchCount++;
					
					if (!firstMatch) {
						firstMatch = element;
					}
				}
			});

			console.log('匹配数量:', matchCount);
			if (matchCount === 0) {
				searchResults.innerHTML = '<p class="no-results">未找到匹配的指令</p>';
			} else {
				searchResults.innerHTML = `<p class="search-info">找到 ${matchCount} 个匹配项</p>`;
				
				// 滚动到第一个匹配项
				if (firstMatch) {
					console.log('滚动到第一个匹配项:', firstMatch);
					
					// 获取元素位置并滚动
					const rect = firstMatch.getBoundingClientRect();
					const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
					const elementTop = rect.top + scrollTop - 100; // 留出顶部空间
					
					console.log('滚动到位置:', elementTop);
					
					// 使用window.scrollTo确保滚动
					window.scrollTo({
						top: elementTop,
						behavior: 'smooth'
					});
					
					// 备用滚动方法
					setTimeout(() => {
						window.scrollTo(0, elementTop);
					}, 100);
					
					// 确保元素可见
					firstMatch.scrollIntoView({ behavior: 'instant', block: 'center' });
					
					// 添加高亮动画效果
					firstMatch.style.transition = 'background-color 0.3s ease';
					setTimeout(() => {
						firstMatch.style.backgroundColor = '#ffeb3b';
						setTimeout(() => {
							firstMatch.style.backgroundColor = '';
						}, 2000);
					}, 200);
				}
			}
		}

		// 清除搜索
		window.clearSearch = function() {
			searchInput.value = '';
			searchResults.innerHTML = '';
			// 移除所有高亮
			const highlightedElements = contentSection.querySelectorAll('.highlight');
			highlightedElements.forEach(el => {
				el.classList.remove('highlight');
			});
		};

		// 监听输入事件 - 移除实时搜索，改为点击按钮搜索
		// searchInput.addEventListener('input', searchCommands);
		
		// 添加回车键搜索功能
		searchInput.addEventListener('keypress', function(e) {
			if (e.key === 'Enter') {
				searchCommands();
			}
		});
		
		// 插件搜索功能
		const pluginSearchInput = document.getElementById('pluginSearch');
		const pluginSearchResults = document.getElementById('pluginSearchResults');
		const pluginSection = document.getElementById('section4');
		
		// 检查DOM元素是否正确获取
		console.log('插件搜索元素状态:');
		console.log('pluginSearchInput:', pluginSearchInput);
		console.log('pluginSearchResults:', pluginSearchResults);
		console.log('pluginSection:', pluginSection);
		
		// 如果元素未找到，输出警告
		if (!pluginSearchInput || !pluginSearchResults || !pluginSection) {
			console.error('插件搜索元素未找到，请检查HTML结构');
		}

		// 插件搜索功能（只定位不隐藏内容）
		function searchPlugins() {
			console.log('搜索按钮被点击，开始搜索...');
			const searchTerm = pluginSearchInput.value.toLowerCase();
			console.log('搜索关键词:', searchTerm);
			
			if (searchTerm === '') {
				pluginSearchResults.innerHTML = '';
				// 移除所有高亮
				const highlightedElements = pluginSection.querySelectorAll('.highlight');
				highlightedElements.forEach(el => {
					el.classList.remove('highlight');
				});
				console.log('搜索词为空，返回');
				return;
			}

			const elements = pluginSection.querySelectorAll('h3, h4, p, ul, li, ol, li');
			console.log('搜索元素数量:', elements.length);
			let matchCount = 0;
			let firstMatch = null;

			// 移除之前的高亮
			const highlightedElements = pluginSection.querySelectorAll('.highlight');
			highlightedElements.forEach(el => {
				el.classList.remove('highlight');
			});

			elements.forEach(element => {
				if (element.textContent.toLowerCase().includes(searchTerm)) {
					element.classList.add('highlight');
					matchCount++;
					
					if (!firstMatch) {
						firstMatch = element;
					}
				}
			});

			console.log('匹配数量:', matchCount);
			if (matchCount === 0) {
				pluginSearchResults.innerHTML = '<p class="no-results">未找到匹配的插件内容</p>';
			} else {
				pluginSearchResults.innerHTML = `<p class="search-info">找到 ${matchCount} 个匹配项</p>`;
				
				// 滚动到第一个匹配项
				if (firstMatch) {
					console.log('滚动到第一个匹配项:', firstMatch);
					
					// 获取元素位置并滚动
					const rect = firstMatch.getBoundingClientRect();
					const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
					const elementTop = rect.top + scrollTop - 100; // 留出顶部空间
					
					console.log('滚动到位置:', elementTop);
					
					// 使用window.scrollTo确保滚动
					window.scrollTo({
						top: elementTop,
						behavior: 'smooth'
					});
					
					// 备用滚动方法
					setTimeout(() => {
						window.scrollTo(0, elementTop);
					}, 100);
					
					// 确保元素可见
					firstMatch.scrollIntoView({ behavior: 'instant', block: 'center' });
					
					// 添加高亮动画效果
					firstMatch.style.transition = 'background-color 0.3s ease';
					setTimeout(() => {
						firstMatch.style.backgroundColor = '#ffeb3b';
						setTimeout(() => {
							firstMatch.style.backgroundColor = '';
						}, 2000);
					}, 200);
				}
			}
		}

		// 清除插件搜索
		window.clearPluginSearch = function() {
			pluginSearchInput.value = '';
			pluginSearchResults.innerHTML = '';
			
			// 移除所有高亮
			const highlightedElements = pluginSection.querySelectorAll('.highlight');
			highlightedElements.forEach(el => {
				el.classList.remove('highlight');
			});
		};

		// 监听插件搜索输入事件 - 移除实时搜索，改为点击按钮搜索
			// pluginSearchInput.addEventListener('input', searchPlugins);
			
			// 添加回车键搜索功能
			pluginSearchInput.addEventListener('keypress', function(e) {
				if (e.key === 'Enter') {
					searchPlugins();
				}
			});
			
			// 确保DOM完全加载
		window.addEventListener('load', function() {
			console.log('页面完全加载，搜索功能已就绪');
			
			// 确保插件搜索按钮事件正确绑定
			const pluginSearchBtn = document.querySelector('#section4 button[onclick="searchPlugins()"]');
			if (pluginSearchBtn) {
				console.log('插件搜索按钮已找到:', pluginSearchBtn);
				pluginSearchBtn.onclick = searchPlugins;
			}
			
			// 确保常用指令搜索按钮事件正确绑定
			const commandSearchBtn = document.querySelector('#section5 button[onclick="searchCommands()"]');
			if (commandSearchBtn) {
				console.log('常用指令搜索按钮已找到:', commandSearchBtn);
				commandSearchBtn.onclick = searchCommands;
			}
		});
	});

	// 留言板功能


	// 全局函数定义
	window.getClientIP = function() {
		let ip = localStorage.getItem('clientIP');
		if (!ip) {
			ip = 'ip_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
			localStorage.setItem('clientIP', ip);
		}
		return ip;
	};

	window.hasIPCommented = async function(ip) {
		try {
			const response = await fetch('/.netlify/functions/getGuestbook');
			const messages = await response.json();
			return messages.some(msg => msg.ip === ip);
		} catch (error) {
			console.error('读取留言数据失败:', error);
			return false;
		}
	};

	window.escapeHtml = function(text) {
		const div = document.createElement('div');
		div.textContent = text;
		return div.innerHTML;
	};

	window.loadMessages = async function() {
		const messagesContainer = document.getElementById('messagesContainer');
		
		try {
			const response = await fetch('/.netlify/functions/getGuestbook');
		const messages = await response.json();
			
			if (messages.length === 0) {
				messagesContainer.innerHTML = '<p class="no-messages">暂无留言，快来留下第一条吧！</p>';
				return;
			}

			let html = '';
			messages.forEach((message) => {
				const date = new Date(message.timestamp);
				const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
				
				html += `
					<div class="message-item">
						<div class="message-header">
							<span class="message-author">${window.escapeHtml(message.name)}</span>
							<span class="message-time">${formattedDate}</span>
						</div>
						<div class="message-content">${window.escapeHtml(message.content)}</div>
						<div class="message-footer">
							<span>来自IP: ${message.ip}</span>
							${message.ip === window.getClientIP() ? `<button class="delete-btn" onclick="window.deleteMessage('${message.id}')">删除</button>` : ''}
						</div>
					</div>
				`;
			});
			
			messagesContainer.innerHTML = html;
		} catch (error) {
			console.error('加载留言失败:', error);
			messagesContainer.innerHTML = '<p class="no-messages">加载留言失败，请刷新页面重试</p>';
		}
	};

	window.deleteMessage = async function(id) {
		if (!confirm('确定要删除这条留言吗？')) {
			return;
		}

		try {
			const response = await fetch('/.netlify/functions/deleteGuestbook', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					id: id,
					ip: window.getClientIP()
				})
			});

			if (response.ok) {
				alert('留言删除成功！');
				window.loadMessages();
			} else {
				const error = await response.json();
				alert('删除失败: ' + (error.error || '未知错误'));
			}
		} catch (error) {
			console.error('删除留言失败:', error);
			alert('删除留言失败，请重试');
		}
	};

	// 表单提交事件处理
	window.submitMessage = async function() {
		const guestNameInput = document.getElementById('guestName');
		const guestMessageInput = document.getElementById('guestMessage');
		const messageStatus = document.getElementById('messageStatus');

		const name = guestNameInput.value.trim();
		const content = guestMessageInput.value.trim();

		if (!name || !content) {
			messageStatus.innerHTML = '<span style="color: #e74c3c;">请填写称呼和留言内容！</span>';
			return;
		}

		// 验证称呼只能由汉字构成
		if (!/^[一-龥]+$/.test(name)) {
			messageStatus.innerHTML = '<span style="color: #e74c3c;">您的称呼只能由汉字构成，不能出现字符、字母、数字</span>';
			return;
		}

		// 检查内容是否包含网页链接
        const urlPattern = /(https?:\/\/|www\.|\.com|\.net|\.org|\.cn|\.io|\.me|\.co|\.info|\.biz|\.tv|\.cc|\.gov|\.edu)/i;
        if (urlPattern.test(content)) {
            messageStatus.innerHTML = '<span style="color: #e74c3c;">留言内容不能包含网页链接，请重新编辑</span>';
            return;
        }

        // 检查留言总字数不能超过100字
        if (content.length > 100) {
            messageStatus.innerHTML = '<span style="color: #e74c3c;">留言内容不能超过100字，请重新编辑</span>';
            return;
        }

		// 检查连续数字数量
		const consecutiveNumbers = content.match(/\d{5,}/g);
		if (consecutiveNumbers && consecutiveNumbers.length > 0) {
			messageStatus.innerHTML = '<span style="color: #e74c3c;">您的留言内容数字数量违规，请重新编辑</span>';
			return;
		}

		// 检查连续字母数量
		const consecutiveLetters = content.match(/[a-zA-Z]{5,}/g);
		if (consecutiveLetters && consecutiveLetters.length > 0) {
			messageStatus.innerHTML = '<span style="color: #e74c3c;">您的留言内容字母数量违规，请重新编辑</span>';
			return;
		}

		const clientIP = window.getClientIP();

		// 检查是否已留言
		const hasCommented = await window.hasIPCommented(clientIP);
		if (hasCommented) {
			messageStatus.innerHTML = '<span style="color: #e74c3c;">每个人只能留言一次！您可以删除之前的留言后重新留言。</span>';
			return;
		}

		const newMessage = {
			name: name,
			content: content,
			timestamp: new Date().toISOString(),
			ip: clientIP
		};

		try {
			// 提交留言到服务端
			const response = await fetch('/.netlify/functions/addGuestbook', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(newMessage)
			});

			if (response.ok) {
				// 清空表单
				guestNameInput.value = '';
				guestMessageInput.value = '';

				// 重新加载留言列表
				await window.loadMessages();

				messageStatus.innerHTML = '<span style="color: #27ae60;">留言成功！</span>';
				setTimeout(() => {
					messageStatus.innerHTML = '';
				}, 3000);
			} else {
				const error = await response.json();
				messageStatus.innerHTML = '<span style="color: #e74c3c;">留言提交失败: ' + (error.error || '未知错误') + '</span>';
			}
		} catch (error) {
			console.error('保存留言失败:', error);
			messageStatus.innerHTML = '<span style="color: #e74c3c;">保存留言失败，请稍后重试</span>';
		}
	};

	window.clearMessage = function() {
		const guestNameInput = document.getElementById('guestName');
		const guestMessageInput = document.getElementById('guestMessage');
		const messageStatus = document.getElementById('messageStatus');
		
		guestNameInput.value = '';
		guestMessageInput.value = '';
		messageStatus.innerHTML = '';
	};

	// 在页面加载完成后初始化留言板
	window.addEventListener('DOMContentLoaded', function() {
		window.loadMessages();
		
		// 添加表单提交事件监听
		const guestbookForm = document.getElementById('guestbookForm');
		if (guestbookForm) {
			guestbookForm.addEventListener('submit', function(e) {
				e.preventDefault();
				window.submitMessage();
			});
		}
		

	});