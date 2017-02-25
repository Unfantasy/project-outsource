/**
 * Created by 吉祥 on 2016/8/13.
 */
var DOMAIN = 'http://www.jiahang-international.com/niconico';
//var DOMAIN = 'http://114.55.67.232/niconico';

function enterpriseArticlesExit() {
    jQuery('.enterpriseArticles').hide();
    jQuery('.enterprise').show();
}

//根据文章id获取文章详情
function openArticle(id){
    jQuery.ajax({
        url: DOMAIN + '/home/article/queryById/' + id,
        dataType: 'json',
        type:'get',
        success: function (data) {
            //data = JSON.parse(data);
            if(data.code==1){
                if(data.data){
                    //data.data = JSON.parse(data.data);
                    var title = data.data.title;
                    var id = data.data.id;
                    var content = data.data.content;
                    var time = jQuery(this).find('span').text();
                    jQuery('.articleBg time').text(time);
                    jQuery('.articleBg h2').text(title);
                    jQuery('.articleContent p').html(content);
                    jQuery(".articleBg").addClass('articleBgOpen');
                    jQuery('.articleBg .nivo-lightbox-close').click(function () {
                        jQuery(".articleBg").removeClass('articleBgOpen');
                    });
                }
            }else{
                alert(JSON.stringify(data));
            }

        },
        error: function (e) {
            alert(JSON.stringify(e));
        }
    });
}
//通过type获取页码和title
function getArticle(type, pageNum) {
    if(!pageNum || isNaN(pageNum) || pageNum<1){
        pageNum = 1;
    }
    jQuery(".articles").empty();
    jQuery.ajax({
        url: DOMAIN + '/home/article/queryByType/' + type + '/' + pageNum,
        dataType: 'json',
        type:'get',
        success: function (data) {
            //data = JSON.parse(data);
            if (data.code == 1) {
                //data.data = JSON.parse(data.data);
                if(data.data.length){
                    for(var i=0;i<data.data.length;i++){
                        data.data[i] = data.data[i];
                        var title = data.data[i].title;
                        var id = data.data[i].id;
                        var d = new Date(data.data[i].gmtModify);
                        var year=d.getFullYear();
                        var day=d.getDate();
                        var month=+d.getMonth()+1;
                        var time = year+"-"+formate(month)+"-"+formate(day);
                        function formate(d){
                            return d>9?d:'0'+d;
                        }
                        var li = '<li onclick="openArticle('+id+',this)">'+title+' <span class="pull-right">'+time+'</span></li>';
                        jQuery(".articles").append(li);
                    }
                }
                //alert(JSON.stringify(data.data));
                console.log(JSON.stringify(data));
            } else if (data.code == -1) {
                alert('获取失败！')
            } else {
                alert(JSON.stringify(data));
            }
        },
        error: function (e) {
            alert(JSON.stringify(e));
        }
    });
}



//获取图片地址
function getImgUrl(id) {
    var requestImgUrl = DOMAIN + '/home/picture/queryById/' + id;
    var imgUrl = '';
    jQuery.get(requestImgUrl, function (data) {
        if (data.code == 1) {
            imgUrl = data.data;
        } else {
            alert('Error');
            alert(JSON.stringify(data));
        }
    }).error(function (e) {
        alert(e)
    });
    return imgUrl;
}

jQuery(function () {
    //getArticle(1,2)
    jQuery(".service").click(function () {
        var serviceTxt = jQuery(this).find('.heading').text();
        switch (serviceTxt) {
            case '公司介绍':
                jQuery(".articleBgInfo").addClass('articleBgOpen');
                jQuery('.articleBgInfo .nivo-lightbox-close').click(function () {
                    jQuery(".articleBgInfo").removeClass('articleBgOpen');
                });
                break;
            case '公司文件':
                showArticleList(1,this);
                break;
            case '最新动态':
                showArticleList(2,this);
                break;
            case '项目列表':
                showArticleList(3,this);
                break;
            case '项目进度':
                showArticleList(4,this);
                break;
            default:
                showArticleList(this);
                break;
        }
        function showArticleList(type){
            if (!type || isNaN(type)){
                type = 1;
            }
        var serviceTitle = '';
        switch(type){
            case 1:
                serviceTitle = '公司文件';
                break;
            case 2:
                serviceTitle = '最新动态';
                break;
            case 3:
                serviceTitle = '项目列表';
                break;
            case 4:
                serviceTitle = '项目进度';
                break;
        }

            //通过type获取总数
            jQuery.ajax({
                url: DOMAIN + '/home/article/queryTotalByType/' + type,
                dataType: 'json',
                type:'get',
                success: function (data) {
                    //data = JSON.parse(data);
                    if (data.code == 1) {
                        if (data.data) {
                            //data.data = JSON.parse(data.data);
                            var total = data.data.total;
                            //alert(total);
                            var pageNum = Math.ceil(total/20) || 1;
                            //getArticle(type, 1);
                            //文章分页
                            var visiblePages = 3;
                            if(pageNum<=3){
                                visiblePages = pageNum;
                            }
                            jQuery.jqPaginator('#pagination', {
                                totalPages: pageNum,
                                visiblePages: visiblePages,
                                currentPage: 1,
                                prev: '<li class="prev"><a href="javascript:;">上一页</a></li>',
                                next: '<li class="next"><a href="javascript:;">下一页</a></li>',
                                page: '<li class="page"><a href="javascript:;">{{page}}</a></li>',
                                onPageChange: function (num, t) {
                                    getArticle(type, num);
                                }
                            });
                            jQuery('.enterprise').hide();
                            jQuery('.enterpriseArticles').show();
                            jQuery('.enterpriseArticles').find('h3').html(serviceTitle + '<span  class="pull-right enterpriseArticlesExit" onclick="enterpriseArticlesExit()">返回</span>');
                        }
                        //alert(JSON.stringify(data));
                        //console.log(JSON.stringify(data));
                    } else if (data.code == -1) {
                        alert('获取失败！')
                    } else {
                        alert(JSON.stringify(data));
                    }
                },
                error: function (e) {
                    alert(JSON.stringify(e));
                }
            });
        }
    });


});