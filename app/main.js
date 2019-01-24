//等待dom结构加载完成
$(function () {
    //获取模型的json文件
    $.ajax({
        url: "json/models.json",
        type: "GET",
        success: function (data) {
            var wrap = $("#models-list .list");
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                //使用js生成列表的dom结构，并将相关数据保存到dom上面
                var dom = "\n" +
                    "            <li data-name='" + item.name + "' data-path='" + item.path + "' data-id='" + item.id + "'>\n" +
                    "                <div class=\"thumbnail\">\n" +
                    "                    <div class='img' style=\"background-image:url(" + item.img + ");\" alt=\"...\"></div>\n" +
                    "                    <div class=\"caption\">\n" +
                    "                        <p>" + item.name + "</p>\n" +
                    "                    </div>\n" +
                    "                </div>\n" +
                    "            </li>";
                wrap.append(dom);
            }
        },
        error: function () {

        }
    });

    //给提交input框绑定点击事件
    $("#models-type .tj").on("click", function () {
        //获取到input框内的内容
        var params = {
            position: {
                x: positionX.val(),
                y: positionY.val(),
                z: positionZ.val()
            },
            rotation: {
                x: rotationX.val(),
                y: rotationY.val(),
                z: rotationZ.val()
            },
            scale: {
                x: scaleX.val(),
                y: scaleY.val(),
                z: scaleZ.val(),
            },
            ch:$("#models-type .ch").val(),
            cg:$("#models-type .cg").val(),
            tcmd:$("#models-type .tcmd").val(),
            sftjzc:$("#models-type .sftjzc").prop('checked'),
            cxk:$("#models-type .cxk").val(),
            xs:$("#models-type .xs").val()
        };

        //请求服务器，将数据传输到后台
        $.ajax({
            url:"",
            type: "GET",
            data:params,
            success:function () {

            },
            error:function () {

            }
        });
        console.log(params);
    });

    //获取九个input框对象
    var positionX = $("#models-type .position-x");
    var positionY = $("#models-type .position-y");
    var positionZ = $("#models-type .position-z");

    var rotationX = $("#models-type .rotation-x");
    var rotationY = $("#models-type .rotation-y");
    var rotationZ = $("#models-type .rotation-z");

    var scaleX = $("#models-type .scale-x");
    var scaleY = $("#models-type .scale-y");
    var scaleZ = $("#models-type .scale-z");

    //获取到切换模型交互的对象
    var control = $("#control-wrap");

    //添加view
    var player = new Player($("#canvas-wrap"));
    player.init();

    //给按钮绑定点击事件
    control.find(".btn").on("click", function () {
        changeBtnColor($(this));
    });

    //给input输入框绑定输入事件
    $("#models-type input").on("input", function () {
        input();
    });

    //添加热点以后的回调
    player.changeHotCallback = function (obj) {
        control.show(); //显示修改框

        //默认让第一个按钮变色
        changeBtnColor(control.find(".btn").eq(0));

        //更新input框的数据
        updateInput(obj);
    };

    //模型控制更新模型后的回调
    player.updateModelCallback = updateInput;

    //创建一个移动的div
    var moveDiv = document.createElement("div");
    moveDiv.className = "move-div";
    document.body.appendChild(moveDiv);

    //添加绑定拖拽事件，拖拽到dom上面会触发
    $("#models-list .list").on("mousedown", "li", function (event) {
        //阻止浏览器的默认事件
        event.preventDefault();
        //获取到按下的列表的数据
        var id = $(this).data("id");
        var name = $(this).data("name");
        var path = $(this).data("path");

        //设置移动div的背景图片
        moveDiv.style.backgroundImage = $(this).find(".img").css("background-image");

        //window的鼠标移动事件，更新移动时图片的位置
        function move(event) {
            //设置移动div显示
            moveDiv.style.display = "block";
            //设置移动div位置
            moveDiv.style.left = event.clientX + "px";
            moveDiv.style.top = event.clientY + "px";
        }

        //window的鼠标抬起事件，如果在view上面抬起，则可以放置模型
        function up(event) {
            //判断鼠标抬起时的dom是否处于canvas上面
            if (event.target === player.renderer.domElement) {
                //获取当前点击的位置点
                var x = event.clientX;
                var y = event.clientY;
                //调用添加模型事件，将模型添加到场景当中
                player.addModel(x, y, id, path, name);
            }

            //设置移动div隐藏
            moveDiv.style.display = "none";

            //解绑事件
            $(document).off("mouseup", up);
            $(document).off("mousemove", move);
        }

        //绑定鼠标移动事件和抬起事件
        $(document).on("mouseup", up);
        $(document).on("mousemove", move);
    });

    //更新input框事件
    function updateInput(obj) {

        //获取到模型的id和name
        var userData = obj.userData;
        $("#models-type .name").val(userData.name);
        $("#models-type .id").val(userData.id);

        //设置位置
        positionX.val(obj.position.x.toFixed(2));
        positionY.val(obj.position.y.toFixed(2));
        positionZ.val(obj.position.z.toFixed(2));

        //设置旋转
        rotationX.val(obj.rotation.x.toFixed(2));
        rotationY.val(obj.rotation.y.toFixed(2));
        rotationZ.val(obj.rotation.z.toFixed(2));

        //设置缩放
        scaleX.val(obj.scale.x.toFixed(2));
        scaleY.val(obj.scale.y.toFixed(2));
        scaleZ.val(obj.scale.z.toFixed(2));
    }

    //按钮切换颜色的方法
    function changeBtnColor(obj) {
        obj.addClass("btn-success").removeClass("btn-default").siblings().addClass("btn-default").removeClass("btn-success");
        //获取到按钮的名称
        var mode = obj.data("name");
        player.setControlMode(mode);
    }

    //输入框输入内容后的回调
    function input() {
        //从输入框获取九个值得内容 --- 注意，从input获取的内容是字符串，需要自己手动转成数字类型
        var params = {
            position: {
                x: positionX.val(),
                y: positionY.val(),
                z: positionZ.val()
            },
            rotation: {
                x: rotationX.val(),
                y: rotationY.val(),
                z: rotationZ.val()
            },
            scale: {
                x: scaleX.val(),
                y: scaleY.val(),
                z: scaleZ.val(),
            }
        };

        //调用构造函数方法更新模型数据
        player.updateModel(params);
    }
});

function Player(container) {
    var that = this;

    that.targetObject = null; //当前场景焦点的模型

    //初始化渲染器
    this.initRenderer = function () {
        that.renderer = new THREE.WebGLRenderer({antialias: true, logarithmicDepthBuffer: true});
        //that.renderer.autoClear = false;
        var renderer = that.renderer;
        renderer.setClearColor("#999999");
        renderer.setSize(container.width(), container.height()); //设置宽和高
        container[0].appendChild(renderer.domElement); //添加到dom
    };

    //初始化场景
    this.initScene = function () {
        that.scene = new THREE.Scene(); //实例化场景

        that.controlScene = new THREE.Scene(); //threejs的bug，模型控制器需要额外的场景

        that.group = new THREE.Group(); //存放模型的场景
        that.scene.add(that.group);
    };

    //初始化相机
    this.initCamera = function () {
        that.camera = new THREE.PerspectiveCamera(45, container.width() / container.height(), 0.1, 20000); //实例化相机
        var camera = that.camera;
        camera.position.set(5, 5, 5);
        that.scene.add(camera);
    };

    //初始化控制器
    this.initControl = function () {
        //相机控制器
        that.control = new THREE.OrbitControls(that.camera, that.renderer.domElement);

        //模型控制器
        that.modelControl = new THREE.TransformControls(that.camera, that.renderer.domElement);
        that.modelControl.setSpace("world");

        that.scene.add(that.modelControl);

        //如果拖拽模型，则禁止相机移动
        that.modelControl.addEventListener('dragging-changed', function (event) {
            that.control.enabled = !event.value;
            //触发模型数据更新回调
            that.modelControl.object && that.updateModelCallback(that.targetObject);
        });
    };

    //设置模型相机的操作方式
    this.setControlMode = function (mode) {
        that.modelControl.setMode(mode);
    };

    //初始化光源--编辑器内是默认不带光源的，后期如果需要可以去掉
    this.initLight = function () {
        that.scene.add(new THREE.AmbientLight(0x666666));
        var light = new THREE.PointLight(0x999999);
        //light.position.set(0, 100, 0);
        that.camera.add(light);
    };

    //初始化动画
    this.animate = function () {
        function donghua() {
            that.draw();
            requestAnimationFrame(donghua);
        }

        donghua();
    };

    //场景绘制
    this.draw = function () {
        //that.composer.render();
        that.renderer.render(that.scene, that.camera);
        //that.renderer.render(that.controlScene, that.camera);
    };

    //添加平面的网格
    this.initGrid = function () {
        var grid = new THREE.GridHelper(500, 200, 0xffffff, 0x333333);
        that.scene.add(grid);

        //添加平面，用于拖拽模型使用
        var plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(5000, 5000));
        plane.rotation.x = -Math.PI / 2;
        plane.visible = false;
        that.plane = plane;
        that.scene.add(plane);
    };

    //初始化时，调用方法进行初始化
    this.init = function () {
        that.initRenderer();
        that.initScene();
        that.initCamera();
        that.initControl();
        that.initOutLine();
        that.initLight();
        that.animate();
        that.initGrid();
        that.addTouch();
    };

    //创建模型的方法
    this.addModel = function (x, y, id, path, name) {
        //通过鼠标抬起的点获得当前场景中的位置
        var position = that.twoToThree(x, y);
        //如果返回的是false，则直接不再处理
        if (!position) {
            return;
        }
        //如果获取到位置，则创建loader加载模型，需要加载一个obj文件和一个mtl文件，当前的obj和mtl文件吗相同，如果有需求，可以自行添加两个文件路径
        var stlLoader = new THREE.STLLoader();
        stlLoader.load("models/"+path, function (geometry) {

            let material = new THREE.MeshLambertMaterial();

            let object = new THREE.Mesh(geometry, material);

            //将数据添加到模型上面
            object.name = id;

            object.userData.id = id;
            object.userData.path = path;
            object.userData.name = name;

            object.position.copy(position); //复制获取到的点的位置

            that.group.add(object);

            that.changeHot(object);
        });

    };

    //添加交互事件
    this.addTouch = function () {
        var raycaster = new THREE.Raycaster();
        var mouse = new THREE.Vector2();
        var renderer = that.renderer;
        //绑定界面的点击事件
        $(renderer.domElement).on("click", function (event) {
            mouse.x = (event.clientX / renderer.domElement.offsetWidth) * 2 - 1;
            mouse.y = -(event.clientY / renderer.domElement.offsetHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, that.camera);

            var intersects = raycaster.intersectObjects(that.group.children, true);
            //返回的是数组，只对点击最近的模型进行处理
            if (intersects.length > 0) {
                var object = getObj(intersects[0].object); //获取到模型的主模型
                that.changeHot(object);
            }
        });

        //获取当前模型组的对象
        function getObj(obj) {
            //遍历判断是否是选中的模型组内的子元素，如果不是则返回它的父元素，继续遍历
            for (var i = 0; i < that.group.children.length; i++) {
                if (that.group.children[i] === obj) {
                    return obj;
                }
            }

            return getObj(obj.parent);
        }
    };

    //将页面中的xy坐标转换为模型场景中的xy坐标
    this.twoToThree = function (x, y) {
        var raycaster = new THREE.Raycaster();
        var mouse = new THREE.Vector2();
        var width = that.renderer.domElement.clientWidth;
        var height = that.renderer.domElement.clientHeight;
        mouse.x = (x / width) * 2 - 1;
        mouse.y = -(y / height) * 2 + 1;
        // 通过鼠标点的位置和当前相机的矩阵计算出raycaster
        raycaster.setFromCamera(mouse, that.camera);
        // 获取raycaster直线和所有模型相交的数组集合
        that.plane.visible = true;
        var intersects = raycaster.intersectObject(that.plane);
        that.plane.visible = false;
        //有焦点，则会返回的数组长度大于零
        if (intersects.length > 0) {
            //返回当前焦点的位置坐标
            return intersects[0].point;
        }
        else {
            return false;
        }
    };

    //创建外边框颜色
    this.initOutLine = function () {
        //根据官方案例做的后处理，按照它的规则创造即可
        var composer, effectFXAA, outlinePass;
        composer = new THREE.EffectComposer(that.renderer);

        var renderPass = new THREE.RenderPass(that.scene, that.camera);
        composer.addPass(renderPass);
        that.composer = composer;

        outlinePass = new THREE.OutlinePass(new THREE.Vector2(container.width(), container.height()), that.scene, that.camera);
        composer.addPass(outlinePass);
        that.outlinePass = outlinePass;

        //设置outLine的线的宽度
        outlinePass.edgeStrength = 10;

        //设置没被物体遮挡部分的线框颜色
        outlinePass.visibleEdgeColor.set("#0000ff");

        //设置被遮挡部分线框的颜色
        outlinePass.hiddenEdgeColor.set("#0000ff");

        effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
        effectFXAA.uniforms['resolution'].value.set(1 / container.width(), 1 / container.height());
        effectFXAA.renderToScreen = true;
        composer.addPass(effectFXAA);
    };

    //切换焦点
    this.changeHot = function (obj) {
        that.targetObject = obj; //设置焦点为当前对象

        that.outlinePass.selectedObjects = [obj]; //给当前目标模型添加外框

        that.modelControl.attach(obj); //给目标模型添加控制

        //调用回调
        that.changeHotCallback(obj);
    };

    //更新模型数据的方法
    this.updateModel = function (params) {
        if(!that.targetObject){
            return;
        }
        //写加号是为了将当前的数值转成数字类型
        that.targetObject.position.set(+params.position.x, +params.position.y, +params.position.z);
        that.targetObject.rotation.set(+params.rotation.x, +params.rotation.y, +params.rotation.z);
        that.targetObject.scale.set(+params.scale.x, +params.scale.y, +params.scale.z);
    };

    //添加回调 - 可以在外部重新覆盖

    //切换模型焦点后的回调
    this.changeHotCallback = function () {
    };

    //更新模型数据信息后的回调
    this.updateModelCallback = function () {

    }


}