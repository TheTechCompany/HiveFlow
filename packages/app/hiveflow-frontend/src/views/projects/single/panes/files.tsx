import { FileExplorer, FileDialog } from "@hexhive/ui";
import { createTheme, Divider, Menu, MenuItem, ThemeProvider } from "@mui/material";
import { Box } from "@mui/material";
import React, { useRef, useState } from "react";
import { useMutation as useApolloMutation, useQuery, useApolloClient } from "@apollo/client";
import { GET_PROJECT_FILES, CREATE_PROJECT_FOLDER, MOVE_PROJECT_FILE, DELETE_PROJECT_FILE, RENAME_PROJECT_FILE, UPLOAD_PROJECT_FILES } from '@hive-flow/api';
import { useProjectInfo } from "../context";
import { FilePreviewDialog } from "../../../../modals/file-preview";
import {nanoid} from 'nanoid'
import { ExplorerModal } from "../../../../modals/file-explorer";
import { saveAs } from 'file-saver'
import { Download, Preview, DriveFileMove } from '@mui/icons-material'

const theme = createTheme({
  palette: {
    primary: {
      main: '#72738b'
    },
    secondary: {
      // light: '#a3b579',
      main: "#87927e"
    }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          overflow: "hidden"
        }
      }
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          background: 'green'
        }
      }
    }
  }
  // palette: {
  //   // primary: {
  //   //   main: '',
  //   // },
  //   // secondary: {
  //   //   main: ''
  //   // }
  // }
});
export const FilePane = () => {

   const [ selected, setSelected ] = useState<string[]>([]);

    const { projectId } = useProjectInfo();

    const client = useApolloClient()

    const [ moveOpen, openMove ] = useState<any>();

    const [activePath, setActivePath] = useState('/');

    const [createFolderOpen, openCreateFolder] = useState<boolean>(false)
    const [filePreviewOpen, openFilePreview] = useState<any  | any[]>(null)

    const [anchorPos, setAnchorPos] = useState<{ top: number, left: number }>()

    const uploading = useRef<{loading?: {id?: string, name?: string, percent?: number}[]}>({loading: []})

    const [createDirectory] = useApolloMutation(CREATE_PROJECT_FOLDER)

    const [ moveFile ] = useApolloMutation(MOVE_PROJECT_FILE)

    const [ deleteFile ] = useApolloMutation(DELETE_PROJECT_FILE)

    const [ renameFile ] = useApolloMutation(RENAME_PROJECT_FILE)

    const [uploadFiles] = useApolloMutation(UPLOAD_PROJECT_FILES, {
      context: {
        fetchOptions: {
          onUploadProgress: (event) => {
            console.log("Upload progress", {event})
            const progress = (event.loaded / event.total) * 100

            uploading.current.loading.forEach((item, ix) => {
              (uploading.current.loading || [])[ix].percent = progress;
            })

          }
        }
      }
    })

    const { data, loading } = useQuery(GET_PROJECT_FILES, {
        variables: {
            id: projectId,
            path: activePath
        }
    })

    const refetch = () => {
        client.refetchQueries({include: ['GetProjectFiles']})
    };
    

    const files = data?.projects?.[0]?.files || [];

    return (

        <Box sx={{ flex: 1 }}>
          <ExplorerModal
              open={Boolean(moveOpen)}
              onClose={() => {
                openMove(null)
              }}
              onSubmit={(path) => {
                moveFile({
                  variables: {
                    project: projectId,
                    path: `${activePath}/${moveOpen.name}`,
                    newPath: path
                  }
                }).then(() => {
                  openMove(null);
                })
              }}
              projectId={projectId}
              />
            <FilePreviewDialog
                open={Boolean(filePreviewOpen)}
                onClose={() => openFilePreview(null)}
                files={Array.isArray(filePreviewOpen) ? (filePreviewOpen || []) : filePreviewOpen != undefined ? [filePreviewOpen] : []}
                />
            
           
            <FileExplorer
              selected={selected}
              onSelectionChange={(selected) => setSelected(selected)}
              path={activePath}
              loading={loading}
              previewEngines={[
                {
                  filetype: '.png',
                  component: ({ file }) => <Box>file</Box>
                }
              ]}
              actions={[
                {key: 'download', icon: <Download />, label: 'Download', onClick: async (file) => {
                  //Download here
                  if(Array.isArray(file)) {
                    await Promise.all(file.map(async (f) => {
                      let saveFile = files.find((a: any) => a.id == f.id)
                      if(saveFile) await saveAs(saveFile.url, saveFile.name)
                    }))
                  }else{

                    let saveFile = files.find((a: any) => a.id == file.id);
                
                    if(saveFile) saveAs(saveFile.url, saveFile.name)
                  }
                }},
                {key: 'move', icon: <DriveFileMove />, label: 'Move', onClick: (file) => {
                  console.log({file})
                  openMove(file)
                }},
                {
                  key: 'preview', 
                  icon: <Preview />,
                  label: 'Preview',
                  onClick: (file) => {
                    let selectedFiles = files.slice();
                 
                    if(Array.isArray(file)){
                      selectedFiles = selectedFiles.filter((x) => file.map((a) => a.id).indexOf(x.id) > -1)
                    }else{
                      selectedFiles = selectedFiles.filter((a) => a.id == (file as any).id) //[file]
                    }
                    console.log("FILE PREVIEW", selectedFiles, file)
                    openFilePreview(selectedFiles)
                  }
                }
              ]}
              onCreateFolder={async (folder) => {
                await createDirectory({
                  variables: {
                    project: projectId,
                    path: `${activePath}/${folder}`
                  }
                })
                  refetch()
                
              }}
              onDelete={async (file) => {
                if(Array.isArray(file)){
                  await Promise.all(file.map(async (file) => {
                    await deleteFile({ variables: { project: projectId, path: `${activePath}/${file.name}` } })
                  }))
                }else{
                  await deleteFile({ variables: { project: projectId, path: `${activePath}/${file.name}` } })
                }
                await refetch()
              }}
              onRename={async (file, newName) => {
                await renameFile({
                  variables: {
                    project: projectId,
                    path: `${activePath}/${file.name}`,
                    newPath: `${activePath}/${newName}`
                  }
                })
                
                await refetch()
              }}
              uploading={uploading.current.loading || []}
              onClick={(file) => {
                openFilePreview(file)
              }}
              onNavigate={(path) => {
                setActivePath(path)
                setSelected([])
              }}
              files={files?.map((x: any) => ({ ...x, isFolder: x.directory })) || []}
              onDrop={(files) => {

                uploading.current.loading = (files || []).map((x) => ({id: nanoid(), name: x.name, percent: 0}));

                uploadFiles({
                  variables: {
                    project: projectId,
                    path: activePath,
                    files
                  }
                }).then(() => {
                  refetch()
                })
              }}
            />
          </Box>
    )
}