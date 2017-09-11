function CameraOverlay(options) {

    this.player = document.createElement('div');
    this.player.id = 'player-' + options.camera.id;

    this.camera = options.camera;
    this.flashplayer = options.flashplayer;

    this.div = document.createElement('div');
    this.div.id = 'wrapper-' + options.camera.id;
    this.div.className = 'camera-outer';

    this.inner = document.createElement('div');
    this.inner.className = 'camera-inner';

    this.close = document.createElement('div');
    this.close.className = 'camera-close';
    this.close.innerHTML = '<i class="fa fa-window-close fa-2x"></i>';

    var that = this;
    this.close.onclick = function() {
      that.disable();
      options.onClose();
    }

    this.inner.appendChild(this.player);
    this.div.appendChild(this.inner);
    this.div.appendChild(this.close);

    this.latlng = new google.maps.LatLng(
      options.camera.geometry.coordinates[1],
      options.camera.geometry.coordinates[0]
    );
  }

  CameraOverlay.prototype = new google.maps.OverlayView();

  CameraOverlay.prototype.ready = false;
  CameraOverlay.prototype.initialize = false;
  CameraOverlay.prototype.enabled = false;

  CameraOverlay.prototype.onRemove = function () {
    this.div.remove();
  };

  CameraOverlay.prototype.onAdd = function () {
    this.getPanes().overlayMouseTarget.appendChild(this.div);
    this.ready = true;
    if (this.initialize) {
      this.initialize = false;
      this.enableWhenReady();
    }
  };

  CameraOverlay.prototype.draw = function () {
    var position = this.getProjection().fromLatLngToDivPixel(this.latlng);
    this.div.style.left = position.x + 'px';
    this.div.style.top = position.y + 'px';
  };

  CameraOverlay.prototype.enable = function () {

    this.enabled = true;
    this.div.classList.add('enabled');

    if (!this.ready) {
      this.initialize = true;
    } else {
      this.ready = true;
      this.enableWhenReady();
    }
  };

  CameraOverlay.prototype.enableWhenReady = function () {
    jwplayer(this.player.id).setup({
      flashplayer: this.flashplayer,
      controls: false,
      stretching: 'fill',
      wmode: 'transparent',
      playlist: [{
        sources: [
          { file: this.camera.properties.rtmp_url },
          { file: this.camera.properties.http_url }
        ]
      }]
    }).on('ready', function(e) {
      this.play();
    });
  };

  CameraOverlay.prototype.disable = function () {
    this.enabled = false;
    this.div.classList.remove('enabled');

    jwplayer(this.player.id).remove();
  };
