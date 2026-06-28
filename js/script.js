$(window).on('load', function () {

    // --- Initialize AOS ---
    AOS.init({
        duration: 1000, // values from 0 to 3000, with step 50ms
        once: true,     // whether animation should happen only once - while scrolling down
        offset: 50      // offset (in px) from the original trigger point
    });

    // --- Initialize Lucide Icons ---
    lucide.createIcons();

    // --- Navbar Logic ---
    var $navbar = $('#navbar');
    var countersTriggered = false; // Flag to run counters only once
    var initialNavbarClasses = 'top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl rounded-full';
    var $scrollTopBtn = $('#scrollTopBtn');

    $(window).scroll(function () {
        var scrollPos = $(this).scrollTop();
        // Navbar scroll logic
        if (scrollPos > 50) {
            $navbar.addClass('navbar-scrolled').removeClass(initialNavbarClasses);
        } else {
            $navbar.removeClass('navbar-scrolled').addClass(initialNavbarClasses);
        }

        // Scroll to Top Button logic
        if (scrollPos > 300) {
            $scrollTopBtn.removeClass('opacity-0 invisible').addClass('opacity-100 visible');
        } else {
            $scrollTopBtn.removeClass('opacity-100 visible').addClass('opacity-0 invisible');
        }

        // Counter animation logic
        var $counters = $('#counters');
        if (!countersTriggered && $counters.length > 0) {
            var counterTop = $counters.offset().top;
            var windowHeight = $(window).height();
            var windowScrollTop = $(this).scrollTop();

            if (windowScrollTop > counterTop - windowHeight + 100) { // Trigger when 100px into view
                $('.counter-value').each(function () {
                    var target = $(this).data('target');
                    animateCounter(this, target);
                });
                countersTriggered = true; // Set flag
            }
        }
    });

    // --- Menu Toggle Logic ---
    var $menuToggle = $('#menu-toggle');
    var $menuOverlay = $('#menu-overlay');

    // --- Mobile Dropdown Logic ---
    $('#mobile-dropdown-toggle').click(function () {
        $(this).toggleClass('is-open');
        const dropdown = $('#mobile-dropdown');
        dropdown.stop(true, true).slideToggle(300).css('display', dropdown.is(':visible') ? 'flex' : 'none');
    });

    $menuToggle.click(function () {
        $(this).toggleClass('is-active');
        $menuOverlay.toggleClass('is-open');
        $('body').toggleClass('overflow-hidden');
    });

    $(window).on('resize', function () {
        if ($(window).width() > 768) { // 768px is 'md' breakpoint
            if ($menuOverlay.hasClass('is-open')) {
                $menuOverlay.removeClass('is-open');
                $menuToggle.removeClass('is-active');
                $('body').removeClass('overflow-hidden');
                $('#mobile-dropdown').slideUp(0);
                $('#mobile-dropdown-toggle').removeClass('is-open');
            }
        }
    });

    // --- Smooth Scroll & Close Menu ---
    $('a[data-scroll]').click(function (e) {
        e.preventDefault();
        var target = $(this).attr('href');

        if (target === '#hero') {
            $('html, body').animate({ scrollTop: 0 }, 1000, 'swing');
        } else {
            $('html, body').animate({
                scrollTop: $(target).offset().top - 80 // Offset for fixed navbar
            }, 1000, 'swing');
        }

        // If overlay is open, close it
        if ($menuOverlay.hasClass('is-open')) {
            $menuToggle.click();
        }
    });

    // --- Animated Counters ---
    function animateCounter(elem, target) {
        $({ count: 0 }).animate({ count: target }, {
            duration: 2000,
            easing: 'swing',
            step: function () {
                $(elem).text(Math.floor(this.count));
            },
            complete: function () {
                $(elem).text(this.count); // Ensure final value
            }
        });
    }

    // --- Collections Swiper ---
    if (document.querySelector('.collections-slider')) {
        var collectionsSwiper = new Swiper('.collections-slider', {
            loop: true,
            slidesPerView: 'auto',
            spaceBetween: 24, // 1.5rem
            grabCursor: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
        });
    }

    // --- Testimonial Slider ---
    var $slides = $('.testimonial-item');
    var currentSlide = 0;

    function showSlide(index) {
        $slides.removeClass('opacity-100').addClass('opacity-0');
        $slides.eq(index).removeClass('opacity-0').addClass('opacity-100');
    }

    showSlide(currentSlide); // Show first slide

    setInterval(function () {
        currentSlide = (currentSlide + 1) % $slides.length;
        showSlide(currentSlide);
    }, 6000); // Change slide every 6 seconds

    // --- Fancybox Initialization ---
    $('[data-fancybox]').fancybox({
        buttons: [
            "zoom",
            "slideShow",
            "thumbs",
            "close"
        ],
        loop: true,
        infobar: true,
        caption: function (instance, item) {
            return $(this).data('caption');
        },
        afterShow: function (instance, current) {
            // Customizations after show
        }
    });

    // --- Footer: Current Year ---
    $('#current-year').text(new Date().getFullYear());

});