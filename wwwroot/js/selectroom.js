'use strict';

/**
 * Select your Room name and identity (screen name).
 * @param $modal - modal for selecting your Room name and identity
 * @param error - Error from the previous Room session, if any
 */
function selectRoom(error) {

    return new Promise(resolve => {

        //$modal.on('shown.bs.modal', function onShow() {
        //    $modal.off('shown.bs.modal', onShow);

        //    $join.click(function onJoin() {
        //        //const identity = $identity.val();
        //        const roomName = $roomName.val();
        //        if (/*identity &&*/ roomName) {
        //            // Append the Room name to the web application URL.
        //            //addUrlParams({ roomName });

        //            // Save the user name.
        //            //localStorage.setItem('userName', identity);

        //            $join.off('click', onJoin);
        //            $modal.modal('hide');
        //        }
        //    });
        //});

        $.ajax({
            type: 'get',
            url: "/Video/GetContacts",
            success: function (res) {
                $("#modalContent").html(res);
                $("#join-room").modal();
                console.log("ERROR: " + error);
                if (error) {
                    $("#erroralert").html(`<h5>${error.name}${error.message
                        ? `: ${error.message}`
                        : ''}</h5>${getUserFriendlyError(error)}`);
                    $("#erroralert").css('display', '');
                } else {
                    $("#erroralert").hide();
                }

                $("#joinButton").click(function onJoin() {
                    $("#joinButton").off('click', onJoin);
                    $("#join-room").modal('hide');
                    const roomName = $("#ContactId").val();
                    resolve({ roomName });
                });
            },
            error: function (err) {
                console.log("Error => Get contacts");
            }
        });
    });

}