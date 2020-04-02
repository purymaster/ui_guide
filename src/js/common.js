(function ($) {

	/******************** 탭메뉴 제어 ********************/

	function setTabMenu() {

		var tabMenu = $('[data-tab-menu]'),
			tabPanel = $('[data-tab-panel] .tabpanel'),
			focusCache,
			target;

		function showPanel(obj) {
			focusCache = obj;
			target = obj.attr('href');
			if (target.indexOf("#")) {
				location.href = target;
			} else {
				tabMenu.find('li').attr("aria-selected", false);
				tabPanel.hide().attr("tabindex", "-1");
				$(this).parent().attr("aria-selected", true);
				$('[data-tab-panel]').find(target).show().attr("tabindex", "0");
			};
		};

		focusCache = tabMenu.find('a').eq(0);
		tabMenu.find('li').attr("aria-selected", false).eq(0).attr("aria-selected", true);
		tabMenu.find('a').attr("tabindex", "-1").eq(0).attr("tabindex", "0")
		tabPanel.attr("tabindex", "-1").eq(0).attr("tabindex", "0").show();
		tabMenu.on('click', 'a', function (e) {
			e.preventDefault();
			showPanel($(this));
		}).on('keydown', 'a', function (e) {
			switch (e.keyCode) {
				case 32:
					e.preventDefault();
					showPanel($(this));
					break;
				case 37:
					$(this).attr("tabindex", "-1");
					if ($(this).parent().index() === 0) {
						tabMenu.find('li:last-child').find('a').attr("tabindex", "0").focus();
					} else {
						$(this).parent().prev().find('a').attr("tabindex", "0").focus();
					};
					break;
				case 39:
					$(this).attr("tabindex", "-1");
					if ($(this).parent().index() === tabMenu.find('li').length - 1) {
						tabMenu.find('li:first-child').find('a').attr("tabindex", "0").focus();
					} else {
						$(this).parent().next().find('a').attr("tabindex", "0").focus();
					};
					break;
			};
		});
		tabPanel.on('keydown', function (e) {
			if (e.shiftKey && e.keyCode === 9) {
				e.preventDefault();
				focusCache.focus();
			};
		});

	};

	/******************** 셀렉트박스 제어 ********************/

	function setSelectBox() {

		var customSelect = $('[data-select-box].custom');

		function setValue(obj) {
			obj.closest('ul').siblings('button').removeClass('on').find('span').html(obj.text());
			obj.closest('.customSelect').find('input[type=hidden]').val(obj.attr('value'));
		};

		// 커스텀 셀렉트박스
		customSelect.find('li').attr("tabindex", "0");
		customSelect.on('click', 'button[type="button"]', function () {
			if ($(this).hasClass('on')) {
				customSelect.find('button').removeClass('on');
			} else {
				customSelect.find('button').removeClass('on');
				$(this).addClass('on').next().find('li').eq(0).focus();
			};
		}).on('click', 'li', function () {
			setValue($(this));
		}).on('keydown', 'li', function (e) {
			var idx = $(this).index();
			switch (e.keyCode) {
				case 9:
					return false;
					break;
				case 13:
				case 32:
					setValue($(this));
					$(this).parent().prev().focus();
					return false;
					break;
				case 27:
					$(this).parent().prev().focus().removeClass('on');
					break;
				case 38:
					idx--;
					break;
				case 40:
					idx++;
					break;
			};
			if (idx < 0) idx = 0;
			$(this).parent().find('li').eq(idx).focus();
		});

		$(document).on('mouseup touchend', function (e) {
			if (!customSelect.is(e.target) && customSelect.has(e.target).length === 0)
				customSelect.find('button').removeClass('on');
		});

	};

	/******************** 스크롤 애니메이션 제어 ********************/

	function setScrollAnimate() {

		var moveEl = $('[data-animation]'), // 무빙 요소
			moveName, // 무빙 정의
			moveDelay, // 순차무빙 딜레이
			moveDuration, // 순차무빙 시간
			scroll, // 스크롤 값
			startPoint = $(window).height() * 0.95, // 애니메이션 시작 높이(밑에서부터 화면 높이의 5%)
			topBtn = $('.move_top'), // TOP 버튼
			topBtnFlag = 0; // TOP 버튼 상태

		moveEl.addClass('wait-animation');
		$(window).on('load scroll', function () {
			scroll = $(this).scrollTop();

			// 순차 애니메이션 제어
			moveEl.each(function () {
				moveName = $(this).data('animation');
				moveDelay = $(this).data('delay') * 100; // 단위 0.1초
				moveDuration = $(this).data('duration') * 1000; // 단위 1초
				$(this).addClass('animated ' + moveName);
				if (moveDelay >= 0)
					$(this).css({
						'-webkit-animation-delay': moveDelay + 'ms',
						'animation-delay': moveDelay + 'ms'
					});
				if (moveDuration >= 0)
					$(this).css({
						'-webkit-animation-duration': moveDuration + 'ms',
						'animation-duration': moveDuration + 'ms'
					});
				if (scroll > $(this).offset().top - startPoint) $(this).removeClass('wait-animation');
			});

			// TOP 버튼 제어
			(scroll === 0) ? topBtn.removeClass('on') : topBtn.addClass('on');

			topBtn.find('button').on('click', function () {
				if (topBtnFlag) return false;
				topBtnFlag = 1;
				$('html, body').animate({
					scrollTop: 0
				}, function () {
					topBtnFlag = 0;
					topBtn.removeClass('on');
				});
				return false;
			});

		});

	};

	$(function () {

		setTabMenu();
		setSelectBox();
		setScrollAnimate();

		/******************** 모달 제어 ********************/

		$('[data-modal] .close').on('click', function () {
			close_modal();
		})

	});

	/******************** 모달, 로딩 제어 ********************/

	function show_modal(target) {
		$(target).show();
	}

	function close_modal() {
		$('[data-modal]').hide();
	}

	function show_loading() {
		$('[data-loading]').show();
	}

	function hide_loading() {
		$('[data-loading]').hide();
	}
})(jQuery);