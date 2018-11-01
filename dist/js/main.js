const ko = window.ko;
(function()
{
    let TagsModel = function(tags) {

        let self=this;

        self.tags = ko.observableArray(tags);
        self.itemToAdd = ko.observable("");
        self.itemToEdit = ko.observable("");
        self.duplicateTags = ko.observable("");
        self.isDialogVisible=ko.observable(false);


        /*ADD a Tag*/
        self.addTag = function() {
            if (self.itemToAdd() !== "") {

                //Keep note of Duplicate Tags
                let duplicateTags='';


                //Parse & Check if the entered tag is integer, non duplicate
                let inputTags=self.itemToAdd().split(/[\s,;\t\n]+/);

                inputTags.forEach( tag =>
                {
                    let parsedTag=parseInt(tag);
                    if(!isNaN(parsedTag))
                    {
                        if( self.tags.indexOf(parsedTag) === -1){
                            // Adds the item.
                            self.tags.push(parsedTag);
                        }
                        else
                        {
                            duplicateTags+=(tag + ',');

                        }

                    }

                });


                //Show Duplicate Alert
                if(duplicateTags.length>0)
                {
                    self.duplicateTags("You have already added the following tags : "+duplicateTags);
                    setTimeout(()=>{

                        self.duplicateTags('');

                    },3000);
                }



                //Convert to JSON before Storing
                let JSONtags = JSON.stringify(ko.toJS(self.tags));
                localStorage.setItem('adcash_tags',JSONtags);


                // Clears the text box, because it's bound to the "itemToAdd" observable
                self.itemToAdd("");
            }
        };

        /*Remove a Tag*/
        self.removeTag = function(tag) {
            self.tags.remove(tag);

            //Convert to JSON before Storing to Localstorage
            let JSONtags = JSON.stringify(ko.toJS(self.tags));
            localStorage.setItem('adcash_tags',JSONtags);
        };


        /*Show the Edit Dialog*/
        self.openDialog=function () {

            let editString='';
            self.tags().forEach((tag)=>{

                editString+=(tag.toString()+',')

            });
            self.itemToEdit(editString);

            self.isDialogVisible(true);

        };

        /*Hide the Edit Dialog*/
        self.closeDialog=function () {

            self.isDialogVisible(false);

        };

        /*Save after editing */
        self.editTag=function () {

            if (self.itemToEdit() !== "") {

                //Keep note of Duplicate Tags
                let duplicateTags='';
                let newTags=[];
                let inputTags=self.itemToEdit().split(/[\s,;\t\n]+/);


                inputTags.forEach( tag =>
                {
                    let parsedTag=parseInt(tag);

                    //Check if the entered tag is integer & Adds the item if it is not present.
                    if(!isNaN(parsedTag))
                    {
                        if( newTags.indexOf(parsedTag) === -1){
                            // Adds the item.
                            newTags.push(parsedTag);
                        }
                        else
                        {
                            duplicateTags+=(tag + ',');

                        }

                    }
                });

                //Show Duplicate Alert
                if(duplicateTags.length>0)
                {
                    self.duplicateTags("You have already added the following tags : "+duplicateTags);
                    setTimeout(()=>{

                        self.duplicateTags('');

                    },3000);
                }


                self.tags(newTags);

                //Convert to JSON before Storing
                let JSONtags = JSON.stringify(ko.toJS(self.tags));
                localStorage.setItem('adcash_tags',JSONtags);

            }

            self.closeDialog();

        }
    };


    /*Get Stored tags from the browser (if any)*/
    let storedTags=[];
    if(localStorage.getItem('adcash_tags')!== null && localStorage.getItem('adcash_tags')!== undefined)
    {
        storedTags=JSON.parse(localStorage.getItem('adcash_tags'));
    }

    ko.applyBindings(new TagsModel(storedTags));
})();